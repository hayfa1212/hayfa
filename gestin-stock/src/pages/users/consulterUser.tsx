import React, { useEffect, useState } from "react";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Adduser from "../users/addUser";
import "../../pages/produit/consulterProduit.css";
import trach from "../../Assets/Trash.svg";
import Modal from "react-modal";
import "./consulterUser.css";
import edit from "../../Assets/edition.png";
import EditUserModal from "../users/updateUser";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: string;
  
  image: string;
}

const PAGE_SIZE = 6;

const ConsulterUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate("/");
        toast.error('you should login')
      }
    };

    checkLoggedIn();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("utilisateur").select();

      if (!error) {
        setUsers(data || []);
        setDisplayUsers(data || []);
      } else {
        toast.error("Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterUsers(value);
  };

  const filterUsers = (searchTerm: string) => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayUsers(filtered);
  };

  const openAddUserModal = () => {
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const openDeleteConfirmationModal = (userId: number) => {
    setDeleteUserId(userId);
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser();
      } else {
        setDeleteUserId(null);
      }
    });
  };

  const deleteUser = async () => {
    if (deleteUserId !== null) {
      try {
        const { error } = await supabase
          .from("utilisateur")
          .delete()
          .eq("id", deleteUserId);

        if (!error) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== deleteUserId)
          );
          setDisplayUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== deleteUserId)
          );
          toast.success("User deleted successfully");
        } else {
          toast.error("Error deleting user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting user");
      }
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return displayUsers.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getTotalPages = () => {
    return Math.ceil(displayUsers.length / PAGE_SIZE);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const { data, error } = await supabase
        .from("utilisateur")
        .update(updatedUser)
        .eq("id", updatedUser.id);

      if (!error) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        setDisplayUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        toast.success("User updated successfully");
      } else {
        toast.error("Error updating user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating user");
    }

    closeEditModal();
  };

  return (
    <div className="home">
      <div>
        <SearchInput onSearch={handleSearch} />
        <div className="change">
          <div className="headProd">
            <p className="titlehead">Users</p>
            <div className="buttons">
              <button onClick={openAddUserModal} className="btn" id="add">
                {" "}
                Add user
              </button>
              <button className="btn">Filters</button>
              <button className="btn">Download all</button>
            </div>
          </div>
          <div>

            <table className="user-table">
              <thead>
                <tr className="table-header">
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageUsers().map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="fullname">
                        <img src={user.image} alt={user.name} className="user-image" />
                        <p>{user.name}</p>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td style={{ color: user.role === 'admin' ? '#10A760' : '#F79009' }}>{user.role}</td>
                    <td>
                      <div>
                        <img
                          src={edit}
                          className="trach"
                          onClick={() => openEditModal(user)}
                          alt="Edit"
                        />
                        <img
                          src={trach}
                          className="action-icon"
                          onClick={() => openDeleteConfirmationModal(user.id)}
                          alt="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={previousPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {getTotalPages()}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === getTotalPages()}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedUser && (
        <EditUserModal
          isOpen={selectedUser !== null}
          onClose={closeEditModal}
          user={selectedUser}
          onUpdate={updateUser}
        />
      )}
      <Adduser isOpen={isAddUserModalOpen} onClose={closeAddUserModal} />
      
      <ToastContainer />
    </div>
  );
};

export default ConsulterUsers;

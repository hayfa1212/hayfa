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

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: string;
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
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
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
  };

  const closeDeleteConfirmationModal = () => {
    setDeleteUserId(null);
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

      closeDeleteConfirmationModal();
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
        <div>
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
            <div className="titleUser">
              <p>Name</p>
              <p>Email</p>
              <p>Phone</p>
              <p>Role</p>
            </div>
            {getCurrentPageUsers().map((user) => (
              <div key={user.id}>
                <div className="ligneuser">
                  <p>{user.name}</p>
                  <p>{user.email}</p>
                  <p>{user.phone}</p>
                  <p>{user.role}</p>
                  <div>
                    <img
                      src={edit}
                      className="trach"
                      onClick={() => openEditModal(user)}
                    />
                    <img
                      src={trach}
                      className="trach"
                      onClick={() => openDeleteConfirmationModal(user.id)}
                    />
                  </div>
                </div>
                <p className="ligne"></p>
              </div>
            ))}
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

      <Modal
        className="modal"
        isOpen={deleteUserId !== null}
        onRequestClose={closeDeleteConfirmationModal}
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="desecion">
          <button onClick={closeDeleteConfirmationModal} className="canc">
            Cancel
          </button>
          <button onClick={deleteUser} className="del">
            Delete
          </button>
        </div>
      </Modal>

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

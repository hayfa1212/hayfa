import React, { useState, useEffect } from "react";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "./consulterUser.css";
import edit from "../../Assets/edition.png";
import trach from "../../Assets/Trash.svg";

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: string;
  image: string; // URL de l'image
}

const ConsultUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("utilisateur").select();

        if (!error) {
          setUsers(data || []);
        } else {
          toast.error("Error fetching users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("An error occurred while fetching users");
      }
    };

    fetchUsers();
  }, []);

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

  return (
    <div className="home">
      <div className="change">
        <div className="headProd">
          <p className="titlehead">Users</p>
          {/* Buttons for adding, filtering, and downloading users */}
        </div>
        <div>
          <div className="titleUser">
            <p>Image</p>
            <p>Full Name</p>
            <p>Email</p>
            <p>Phone Number</p>
            <p>Role</p>
            <p>Action</p>
          </div>
          {users.map((user) => (
            <div key={user.id} className="ligneuser">
              <div>
                <img src={user.image} alt={user.name} className="user-image" />
              </div>
              <div>
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{user.phone}</p>
                <p style={{ color: user.role === "admin" ? "#10A760" : "#F79009" }}>{user.role}</p>
              </div>
              <div>
                <img src={edit} className="trach" />
                <img
                  src={trach}
                  className="trach"
                  onClick={() => openDeleteConfirmationModal(user.id)}
                />
              </div>
            </div>
          ))}
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

      <ToastContainer />
    </div>
  );
};

export default ConsultUsers;

// EditUserModal.tsx
import React, { useState } from "react";
import Modal from "react-modal";
import './update.css'

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const [editedUser, setEditedUser] = useState<User>(user);

  // Function to handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedUser);
  };

  return (
    <Modal
      className="modals"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="space">
        <div className="columns">
        <label htmlFor="name">Name:</label>
        <input type="text"
          id="name"
          name="name"
          value={editedUser.name}
          onChange={handleInputChange}
        />
        </div>
        <div className="columns">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={editedUser.email}
          onChange={handleInputChange}
        />
        </div>
        <div className="columns">
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={editedUser.phone}
          onChange={handleInputChange}
        />
        </div>
        <div className="columns">
        <label htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          name="role"
          value={editedUser.role}
          onChange={handleInputChange}
        />
        </div>
        <div className='buttons'>
        <button type="button" onClick={onClose} className="cancel">Cancel</button>
        <button type="submit" className='add'>Update</button>   
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;

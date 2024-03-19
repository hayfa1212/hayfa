import React from "react";
import Modal from "react-modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this product?</p>
      <button onClick={onDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </Modal>
  );
};

export default ConfirmationModal;

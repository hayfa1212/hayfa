import React from "react";


interface ModalProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode; // Ajouter la propriété children
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children } ) => {
    if (!open) return null;

    return (
        <div className="modal" >
            <div >
                <span className="close" onClick={onClose}>&times;</span>
                <div>
                {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

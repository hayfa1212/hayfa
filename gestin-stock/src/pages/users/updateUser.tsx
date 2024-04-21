import React from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './update.css';

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: string;
  image: string; 
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
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.number().typeError("Phone must be a number").required("Phone is required"),
    role: Yup.string().required("Role is required"),
    image: Yup.string().required("Image is required"), 
  });

  return (
    <Modal
      className="modals"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
     
      <Formik
        initialValues={user}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onUpdate({ ...values, image: values.image }); 
        }}
      >
        <Form className="space">
        <p className="head" id="newUser">Edit User</p>
          <div className="User">
            <label htmlFor="name" id="attribute">Name:</label>
            <Field type="text" id="name" name="name"  className="columnUser"/>
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div className="User" id="dis">
            <label htmlFor="email" id="attribute">Email:</label>
            <Field type="email" id="email" name="email"  className="columnUser"/>
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div className="User">
            <label htmlFor="phone" id="attribute">Phone:</label>
            <Field type="text" id="phone" name="phone" className="columnUser" />
            <ErrorMessage name="phone" component="div" className="error" />
          </div>
          <div className="User">
              <label htmlFor="role" id="attribute">Role</label>
              <Field as="select" id="role" name="role" className="columnUser" placeholder="Select Role">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="responsable stock">Responsable stock</option>
                <option value="responsable logistique">Responsable logistique</option>
              </Field>
             
            </div>
          <div className="User">
            
            <Field type="text" id="image" name="image" className="cach"/>
            <ErrorMessage name="image" component="div" className="error" />
          </div>
          <div className='buttons'>
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
            <button type="submit" className='add'>Update</button>   
          </div>
        </Form>
      </Formik>
    </Modal>
  );
};

export default EditUserModal;

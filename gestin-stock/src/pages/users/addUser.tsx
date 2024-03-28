import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import './addUser.css'

interface User {
  name: string;
  email: string;
  phone: number;
  role: string;
}

interface AddSupplierProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialValues: User = {
  name: "",
  email: "",
  phone: 0,
  role: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  phone: Yup.number().required("Required"),
  role: Yup.string().required("Required"),
});

const Adduser: React.FC<AddSupplierProps> = ({ isOpen, onClose }) => {
  const [values, setValues] = useState(initialValues);

  const handleLogin = async (values: User) => {
    try {
      await supabase.from("utilisateur").insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        role: values.role,
      });
      toast.success("User added successfully!");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add User Modal"
      style={{content: {width: '22rem', height: '22rem', marginLeft: '25rem'}}}
    >
   
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form className="form">
               <p>Add User</p>
            <div className="User">
              <label htmlFor="name" >Full Name</label>
              <Field type="text" id="name" name="name"  className="columnUser"/>
              {errors.name && touched.name && (
                <div>{errors.name}</div>
              )}
            </div>

            <div className="User">
              <label htmlFor="email" >Email</label>
              <Field type="email" id="email" name="email"  className="columnUser"/>
              {errors.email && touched.email && (
                <div>{errors.email}</div>
              )}
            </div >

           

            <div className="User">
              <label htmlFor="role">Role</label>
              <Field type="text" id="role" name="role" className="columnUser" />
              {errors.role && touched.role && (
                <div>{errors.role}</div>
              )}
            </div>

            <div className="User">
              <label htmlFor="phone">Phone Number</label>
              <Field type="number" id="phone" name="phone"  className="columnUser"/>
              {errors.phone && touched.phone && (
                <div>{errors.phone}</div>
              )}
            </div>

            <div className="btnUser">
              <button type="button" onClick={onClose} id="cancel"  className="cancel">Discard</button>
              <button type="submit" className='add'>Add User</button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default Adduser;

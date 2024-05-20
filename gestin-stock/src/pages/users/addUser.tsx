import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "./addUser.css";


interface User {
  name: string;
  email: string;
  phone: number;
  role: string;
  image: File | null; // Modify to contain a File object
}

interface AddSupplierProps {//MODAL
  isOpen: boolean;
  onClose: () => void;
}

const initialValues: User = {
  name: "",
  email: "",
  phone: 0,
  role: "",
  image: null, 
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  phone: Yup.number().required("Required"),
  role: Yup.string().required("Required"),
});

const Adduser: React.FC<AddSupplierProps> = ({ isOpen, onClose }) => {
  const [values, setValues] = useState(initialValues);

  const handleUpload = async (values: User) => {
    try {
      if (values.image !== null) {
        const { data, error } = await supabase.storage.from("test").upload(
          values.name,
          values.image
        );
        if (error) {
          throw error;
        }
        const response = await supabase.storage.from("test").getPublicUrl(values.name);
const imageUrl = response.data.publicUrl;



        const { error: insertError } = await supabase
          .from("utilisateur")
          .insert({
            name: values.name,
            email: values.email,
            phone: values.phone,
            role: values.role,
            image: imageUrl,
          });
        if (insertError) {
          throw insertError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("utilisateur")
          .insert({
            name: values.name,
            email: values.email,
            phone: values.phone,
            role: values.role,
          });
        if (insertError) {
          throw insertError;
        }
      }
      const { error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: "admin", // You can set a default password for new users
      });

      if (authError) {
        throw authError;
      }
      toast.success("User added successfully!");
      onClose();
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
      style={{ content: { width: "25rem", height: "26rem", marginLeft: "25rem" ,marginTop:"5rem"} }}
    >
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={(values) => handleUpload(values)}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="form">
            <p id="newUser">New User</p>
            
            <div className="User">
             
              <input
                id="image"
                name="image"
                className="drag"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget.files && event.currentTarget.files.length > 0) {
                    setFieldValue("image", event.currentTarget.files[0]);
                  }
                }}
              />
             
            </div>


            <div className="User">
              <label htmlFor="name" id="attribute">Full Name</label>
              <Field type="text" id="name" name="name" className="columnUser" placeholder="Full Name"/>
              {errors.name && touched.name && <div>{errors.name}</div>}
            </div>

            <div className="User">
              <label htmlFor="email" id="attribute">Email</label>
              <Field type="email" id="email" name="email" className="columnUser"    placeholder="Enter email"/>
              {errors.email && touched.email && <div>{errors.email}</div>}
            </div>

            <div className="User">
              <label htmlFor="role" id="attribute">Role</label>
              <Field as="select" id="role" name="role" className="columnUser" placeholder="Select Role">
                 <option value="admin">Admin</option>
                <option value="responsable stock">responsable stock</option>
                <option value="responsable logistique">responsable logistique</option>
                </Field>
               {errors.role && touched.role && <div>{errors.role}</div>}
            </div>


            <div className="User">
              <label htmlFor="phone" id="attribute">Phone Number</label>
              <Field type="number" id="phone" name="phone" className="columnUser" placeholder="Enter user phone number"/>
              {errors.phone && touched.phone && <div>{errors.phone}</div>}
            </div>

           

            <div className="btnUser">
              <button type="button" onClick={onClose} id="cancel" className="cancel">
                Discard
              </button>
              <button type="submit" className="add">
                Add User
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default Adduser;

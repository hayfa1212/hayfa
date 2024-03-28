import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import './ajoutSupplier.css'

interface Supplier {
  supplier: string;
  product: string;
  contact: number;
  email:string;
}

interface AddSupplierProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialValues: Supplier = {
  supplier: "",
  product: "",
  contact: 0,
  email:"",
};

const validationSchema = Yup.object({
  supplier: Yup.string().required("Required"),
  product: Yup.string().required("Required"),
  contact: Yup.number().required(),
  email:Yup.string().email()
});

const Addsupplier: React.FC<AddSupplierProps> = ({ isOpen, onClose }) => {
  const [values, setValues] = useState(initialValues);

  const handleLogin = async (values: Supplier) => {
    try {
      await supabase.from("supplier").insert({
        name: values.supplier,
        product: values.product,
        contact: values.contact,
        email:values.email,
      });
      toast.success("Supplier added successfully!");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error adding supplier:");
      toast.error("Failed to add supplier");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Supplier Modal"
      style={{content: {width: '25rem', height: '25rem', marginLeft: '25rem'}}}
    >
   
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form className="form">
               <p className="sup">Add Supplier</p>
            <div className="Supplier">
              <label htmlFor="supplier" >Supplier</label>
              <Field type="text" id="supplier" name="supplier"  className="columnSupplier"/>
              {errors.supplier && touched.supplier && (
                <div>{errors.supplier}</div>
              )}
            </div>

            <div className="Supplier">
              <label htmlFor="product" >Product</label>
              <Field type="text" id="product" name="product"  className="columnSupplier"/>
              {errors.product && touched.product && (
                <div>{errors.product}</div>
              )}
            </div >

            <div className="Supplier">
              <label htmlFor="contact">Contact</label>
              <Field type="number" id="contact" name="contact"  className="columnSupplier"/>
              {errors.contact && touched.contact && (
                <div>{errors.contact}</div>
              )}
            </div>

            <div className="Supplier">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" className="columnSupplier" />
              {errors.email && touched.email && (
                <div>{errors.email}</div>
              )}
            </div>

            <div className="btnSupplier">
            
              <button type="button" onClick={onClose} id="cancel ">Cancel</button>
              <button type="submit" className="confirm">Add Supplier</button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default Addsupplier;

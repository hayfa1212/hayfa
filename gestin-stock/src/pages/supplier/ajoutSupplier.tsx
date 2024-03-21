import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

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
      style={{content: {width: '25rem', height: '30rem', marginLeft: '25rem'}}}
    >
      <h2>Add Supplier</h2>
      <Formik
        initialValues={values}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form>
            <div>
              <label htmlFor="supplier">Supplier</label>
              <Field type="text" id="supplier" name="supplier" />
              {errors.supplier && touched.supplier && (
                <div>{errors.supplier}</div>
              )}
            </div>

            <div>
              <label htmlFor="product">Product</label>
              <Field type="text" id="product" name="product" />
              {errors.product && touched.product && (
                <div>{errors.product}</div>
              )}
            </div>

            <div>
              <label htmlFor="contact">Contact</label>
              <Field type="number" id="contact" name="contact" />
              {errors.contact && touched.contact && (
                <div>{errors.contact}</div>
              )}
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" />
              {errors.email && touched.email && (
                <div>{errors.email}</div>
              )}
            </div>

            <div>
              <button type="submit">Add</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default Addsupplier;

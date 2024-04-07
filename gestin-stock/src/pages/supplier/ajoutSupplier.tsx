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
  id:Number;
  product: string;
  contact: number;
  email:string;
  type:string;
  onTheWay:string;
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
  type:"",
  onTheWay:"",
  id:0,
};

const validationSchema = Yup.object({
  supplier: Yup.string().required("Required"),
  product: Yup.string().required("Required"),
  contact: Yup.number().required(),
  email:Yup.string().email(),
  type:Yup.string(),
  onTheWay:Yup.string()
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
        type:values.type,
        onTheWay:values.onTheWay,
        id:values.id
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
               <p id="attribute">Add Supplier</p>
            <div className="Supplier">
              <label htmlFor="supplier" >Supplier Name</label>
              <Field type="text" id="supplier" name="supplier"  className="columnUser" placeholder="Enter supplier name"/>
              {errors.supplier && touched.supplier && (
                <div>{errors.supplier}</div>
              )}
            </div>
            <div className="Supplier">
              <label htmlFor="id" >Supplier ID</label>
              <Field type="number" id="id" name="id" className="columnUser" placeholder="Enter supplier id"/>
              {errors.supplier && touched.supplier && (
                <div>{errors.supplier}</div>
              )}
            </div>

            <div className="Supplier">
              <label htmlFor="product" >Product</label>
              <Field type="text" id="product" name="product"  className="columnUser" placeholder="Enter Product Name"/>
              {errors.product && touched.product && (
                <div>{errors.product}</div>
              )}
            </div >

            <div className="Supplier">
              <label htmlFor="contact">Contact</label>
              <Field type="number" id="contact" name="contact"  className="columnUser" placeholder="Enter supplier contact "/>
              {errors.contact && touched.contact && (
                <div>{errors.contact}</div>
              )}
            </div>

            <div className="Supplier">
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" className="columnUser" placeholder="Enter email" />
              {errors.email && touched.email && (
                <div>{errors.email}</div>
              )}
            </div>
            <div className="Supplier">
            <label htmlFor="type">Type</label>
             <Field as="select" id="type" name="type" className="columnUser">
             <option value="">Select Type</option>
             <option value=" Take Return">Take Return</option>
             <option value="not Take Return">Not Take Return</option>
            </Field>
          {errors.type && touched.type && (
             <div>{errors.type}</div>
              )}
             </div>

            <div className="Supplier">
              <label htmlFor="onTheWay">On The Way</label>
              <Field type="text" id="onTheWay" name="onTheWay" className="columnUser" placeholder="Enter the way" />
              {errors.email && touched.email && (
                <div>{errors.email}</div>
              )}
            </div>

            <div className="btnSupplier">
            
              <button type="button" onClick={onClose} id="cancels">Cancel</button>
              <button type="submit" className="confirm">Add Supplier</button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default Addsupplier;

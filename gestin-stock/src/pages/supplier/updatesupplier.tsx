import React from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface Supplier {
  
  supplier: string;
  id:Number;
  product: string;
  contact: number;
  email:string;
  type:string;
  onTheWay:string;
}

interface EditSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: Supplier;
    onUpdate: (updatedSupplier: Supplier) => void;
  }

const EditsupplierModal: React.FC<EditSupplierModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onUpdate,
}) => {
  const validationSchema = Yup.object({
    supplier: Yup.string().required("Required"),
    product: Yup.string().required("Required"),
    contact: Yup.number().required(),
    email:Yup.string().email(),
    type:Yup.string(),
    onTheWay:Yup.string()
  });

  return (
    <Modal
      className="modals"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
     
      <Formik
        initialValues={supplier}
        validationSchema={validationSchema}
        onSubmit={(values) => {
            onUpdate({ ...values }); 
          }}
      >
       <Form className="space">
  <p className="head" id="newUser">Edit User</p>
  <div className="User">
    <label htmlFor="supplier" id="attribute">Supplier:</label>
    <Field type="text" id="supplier" name="supplier"  className="columnUser"/>
    <ErrorMessage name="supplier" component="div" className="error" />
  </div>
  <div className="User" id="dis">
    <label htmlFor="email" id="attribute">Email:</label>
    <Field type="email" id="email" name="email"  className="columnUser"/>
    <ErrorMessage name="email" component="div" className="error" />
  </div>
  <div className="User">
    <label htmlFor="contact" id="attribute">Contact:</label>
    <Field type="text" id="contact" name="contact" className="columnUser" />
    <ErrorMessage name="contact" component="div" className="error" />
  </div>
  <div className="User">
    <label htmlFor="product" id="attribute">Product:</label>
    <Field type="text" id="product" name="product" className="columnUser" />
    <ErrorMessage name="product" component="div" className="error" />
  </div>
  <div className="User">
  <label htmlFor="type" id="attribute">Type:</label>
  <Field as="select" id="type" name="type" className="columnUser">
    <option value="">Select Type</option>
    <option></option>
    <option value="Take Return">Take Return</option>
    <option value="Not Take Return">Not Take Return</option>
  </Field>
  <ErrorMessage name="type" component="div" className="error" />
</div>
  <div className="User">
    <label htmlFor="onTheWay" id="attribute">On The Way:</label>
    <Field type="text" id="onTheWay" name="onTheWay" className="columnUser" />
    <ErrorMessage name="onTheWay" component="div" className="error" />
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

export default EditsupplierModal;

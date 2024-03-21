import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal'
import supabase from "../../utils/api";
import './ajoutProduit.css'
import DragImage from "./dragImg";

interface Product {
  name: string;
  id: number;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  expire: string;
  thershold: number;
  availability: string;
}

const initialValues: Product = {
  name: "",
  id: 0,
  category: "",
  price: 0,
  quantity: 0,
  unit: "",
  expire: "",
  thershold: 0,
  availability: "Out of stock",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  id: Yup.number().required("Required"),
  category: Yup.string().required("Required"),
  quantity: Yup.number(),
  unit: Yup.string(),
  expire: Yup.date(),
  thershold: Yup.number()
});

interface AjoutproduitProps {
  isOpen: boolean;
  onClose: () => void;
}

const Ajoutproduit: React.FC<AjoutproduitProps> = ({ isOpen, onClose }) => {
  const handleLogin = async (values: Product) => {
     try {
      const { data, error } = await supabase.from('product').insert([
   {  product_Name: values.name,
     id: values.id,
     Category: values.category ,
   buying_price:values.price,
   quantity:values.quantity,
   unit:values.unit,
   expire:values.expire,
   thershold:values.thershold,
   availibilty: values.quantity > 0 ? "in-stock" : "Out of stock"
 },
 ])
 .select()

 
       console.log(data);
 
       if (!error) {
         toast.success('Success');
       }
     } catch (error) {
       console.error('Error during sign up:', error);
       toast.error('An error occurred during sign up. Please try again later.');
     } 
  };

  return (
    <Modal  isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}  style={{content: {width: '25rem', height: '30rem', marginLeft: '25rem'}}}>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="form">
              
              <DragImage/>
             <div className="column">
              <label htmlFor='name'>Name</label>
              <Field type='text' id='name' name='name' className='productclomn' />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div className="column">
              <label htmlFor='id'>ID</label>
              <Field type='number' id='id' name='id' className='productclomn' />
              <ErrorMessage name="id" component="div" className="error" />
            </div>

            <div className="column">
              <label htmlFor='category'>Category</label>
              <Field type='text' id='category' name='category' className='productclomn' />
              <ErrorMessage name="category" component="div" className="error" />
            </div>

            <div className="column">
              <label htmlFor='price'>price</label>
              <Field type='number' id='price' name='price' className='productclomn' />
              <ErrorMessage name="price" component="div" className="error" />
            </div>

            
          <div className="column">
              <label htmlFor='quantity'>quantity</label>
              <Field type='number' id='quantity' name='quantity'className='productclomn' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                setFieldValue('quantity', value);
                setFieldValue('availability', parseInt(value) > 0 ? "In stock" : "Out of stock");
              }} />
              <ErrorMessage name="quantity" component="div" className="error" />
            </div>

            <div className="column">
             <label htmlFor='unit'>unit</label>
              <Field type='text' id='unit' name='unit' className='productclomn' />
              <ErrorMessage name="unit" component="div" className="error" />
            </div>


             <div className="column">
             <label htmlFor='expire'>expire</label>
              <Field type='date' id='expire' name='expire' className='productclomn' />
              <ErrorMessage name="expire" component="div" className="error" />
            </div>
                   

              <div className="column">
             <label htmlFor='thershold'>thershold</label>
              <Field type='float' id='thershold' name='thershold' className='productclomn'/>
              <ErrorMessage name="thershold" component="div" className="error" />
            </div>

         

              <div className='buttons'>
                <button type='button' onClick={onClose} className="cancel">Discard</button>
                <button type='submit' className='add'>Add Product</button>
              </div>

              <ToastContainer />
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default Ajoutproduit;

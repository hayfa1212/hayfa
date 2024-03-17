import supabase from '../../utils/api';
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';


interface Product {
  name: string;
  id: number;
  category: string;
  price:number;
 quantity:number;
 unit:string;
 expire:string;
 thershold:number;
 
}

const initialValues: Product = {
  name: "",
  id: 0,
  category: "",
  price:0,
  quantity:0,
  unit:"",
 expire:"",
 thershold:0,
 
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  id: Yup.number().required("Required"),
  category: Yup.string().required("Required"),
quantity:Yup.number(),
unit:Yup.string(),
expire:Yup.date(),
thershold:Yup.number()
});

const Ajoutproduit: React.FC = () => {

  const handleLogin = async (values: Product) => {
    
   const currentUser= await supabase.auth.getUser()
   console.log(currentUser)
    try {
     const { data, error } = await supabase.from('product').insert([
  {  product_Name: values.name,
    id: values.id,
    Category: values.category ,
  buying_price:values.price,
  quantity:values.quantity,
  unit:values.unit,
 expire:values.expire,
 thershold:values.thershold
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
    <div className='creeCompte'>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form className="form">
            <div>
              <label htmlFor='name'>Name</label>
              <Field type='text' id='name' name='name' className='put' />
              <ErrorMessage name="name" component="div" className="error" />
            </div>

            <div>
              <label htmlFor='id'>ID</label>
              <Field type='number' id='id' name='id' className='put' />
              <ErrorMessage name="id" component="div" className="error" />
            </div>

            <div>
              <label htmlFor='category'>Category</label>
              <Field type='text' id='category' name='category' className='put' />
              <ErrorMessage name="category" component="div" className="error" />
            </div>

            <div>
              <label htmlFor='price'>price</label>
              <Field type='number' id='price' name='price' className='put' />
              <ErrorMessage name="price" component="div" className="error" />
            </div>

            
          <div>
              <label htmlFor='quantity'>quantity</label>
              <Field type='number' id='quantity' name='quantity' className='put' />
              <ErrorMessage name="quantity" component="div" className="error" />
            </div>

            <div>
             <label htmlFor='unit'>unit</label>
              <Field type='text' id='unit' name='unit' className='put' />
              <ErrorMessage name="unit" component="div" className="error" />
            </div>


             <div>
             <label htmlFor='expire'>expire</label>
              <Field type='date' id='expire' name='expire' className='put' />
              <ErrorMessage name="expire" component="div" className="error" />
            </div>
                   

              <div>
             <label htmlFor='thershold'>thershold</label>
              <Field type='float' id='thershold' name='thershold' className='put' />
              <ErrorMessage name="thershold" component="div" className="error" />
            </div>
                   

            <div className='button'>
              <button type='submit' className='start'>Sign in</button>
            </div>

            <ToastContainer />
          </Form>
        )}
      </Formik>

     
    </div>
  );
};

export default Ajoutproduit;

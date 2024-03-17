import './creeCompte.css'
import supabase from '../../utils/api';
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Logo from '../../Components/siginCommun/logoSigin';
import Title from '../../Components/siginCommun/title';
import google from '../../Assets/google.png';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { NavLink, useNavigate   } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import './authentifier.css'
import Msglink from '../../Components/siginCommun/sigincommun';


interface AccountFormValues {
  email: string;
  password: string;
  name:string;
}

const initialValues:AccountFormValues = {
  email: "",
  password: "",
  name:"",
};

const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required").min(8, 'Password must be at least 8 characters long'),
});

const Account: React.FC = () => {

  const handleLogin = async (values: AccountFormValues) => {
     try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password
      });
  
      console.log(data);
  
     
  
      if (!error) {
        toast.success('Success');
      } else if (error?.status === 429 && error?.message) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      toast.error('An error occurred during sign up. Please try again later.');
    }
  };
  
 


  return (
    <div className='creeCompte' >
      <Logo/>
      <div className='formAccount'>
      <Title 
title={'Create an account'}
subTitle={'Start your 30-day free trial.'}/>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      
      >
        {({ errors, touched }) => (
          <Form  className="form">
            <div >
             <div>
              <label htmlFor='name'>Name</label>
              <Field type='name' id='name' name='name'  className='put'/>
              {errors.email && touched.email && <div>{errors.email}</div>}
            </div>

            <div>
              <label htmlFor='email'>Email</label>
              <Field type='email' id='email' name='email'  className='put'/>
              {errors.email && touched.email && <div>{errors.email}</div>}
            </div>

            <div>
              <label htmlFor='password'>Password</label>
              <Field type='password' id='password' name='password'  className='put'/>
              {errors.password && touched.password && (
                <div>{errors.password}</div>
              )}
            </div>
            </div>
           
          <div  className='button'>
          <button type='submit'  className='start' >sing in</button>
            <button className='emailButton'><img src={google} className='google' />Sigin up with Google</button>
            </div>
         <ToastContainer/>
           
          </Form>
        )}
      </Formik>
      
      <Msglink
     direction="/"
     msg="already have an account?"
     destination="Log in"/>
    </div>
  
    </div>
    
  );
};

export default Account;
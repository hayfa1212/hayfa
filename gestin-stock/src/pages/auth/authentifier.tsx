import supabase from "../../utils/api";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify'; // Importez toast
import google from '../../Assets/google.png'
import Title from "../../Components/siginCommun/title";
import './authentifier.css'
import Logo from "../../Components/siginCommun/logoSigin";
import { Link, useNavigate } from "react-router-dom";
import Msglink from "../../Components/siginCommun/sigincommun";


interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string().required("Required"),
  rememberMe: Yup.boolean(),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = async (values: LoginFormValues) => {
    
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      console.log(data)
      if (!error) {
        toast.success('Success');
        setIsLoggedIn(!isLoggedIn)
        
const { error } = await supabase
.from('utilisateur')
.update({ connecter: true })
.eq('email', values.email)
        navigate('/inventory')
        const setedSession=  await supabase.auth.setSession({
          access_token:data.session?.access_token,
          refresh_token:data.session?.refresh_token,
        })
      }
   if(error?.status == 400){
    toast.error('error')

   }
   
  };

  return (
    <div className='login'>
      <Logo/>
         <div className='formLogin'>
      <Title
   title={'Log in to your account'}
   subTitle={'Welcome back! Please enter your details.'}/>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form className="form">
            <div>
            <div>
              <label htmlFor="email">Email</label>
              <Field type="email" id="email" name="email" className='put' />
              {errors.email && touched.email && <div>{errors.email}</div>}
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <Field type="password" id="password" name="password" className='put' />
              {errors.password && touched.password && (
                <div>{errors.password}</div>
              )}
            </div>

            <div className='check'>
              <div className="checkbox">
                <Field type="checkbox" name="rememberMe"  className='msg'/>
                <label>   Remember me  </label>
                </div>
              <a href="/frogot"  className='forgot'>Forgot password?</a>
            </div> 
            </div>
            
            <div className='button'>
            <button type="submit" className="start">Login</button>
            <button className='emailButton'><img src={google} className='google' />Sigin up with Google</button>
            </div> 
            <ToastContainer/>
          </Form>
        )}
      </Formik>
      
     <Msglink
     direction="/Account"
     msg="don't have an account?"
     destination="Sigin in"/>
    </div>
      </div>

  );
};

export default Login;



import * as React from 'react'
import {Formik,Form,Field,ErrorMessage} from 'formik'
import * as Yup from 'yup'
import supabase from '../../utils/api'
import { ToastContainer, toast } from 'react-toastify'
import Logo from '../../Components/siginCommun/logoSigin'
import Title from '../../Components/siginCommun/title'
import Msglink from '../../Components/siginCommun/sigincommun'
import { error } from 'console'





interface MyFormValues {
    email: string
}

export const Forgot: React.FC<{}> = () => {
    const initialValues: MyFormValues = { email: ''};
    
    

    return (
        <div className='forgot'>
           
            
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email().required(),
                    })}
                
                    onSubmit= {async(values) => {
                    console.log('form submit', values)
                    const forgetPassword = await supabase.auth.resetPasswordForEmail(values.email, {
                        redirectTo: 'http://localhost:3000/Restpass',
                        
                      })
                      
                    if (forgetPassword) {
                        toast.success('check your email')
                     }}}
            >
                {({ errors, touched }) => (

                    
                    <Form className='login'>
                          <Logo/>
                           <div className='formLogin'   >
                          <Title
                        title={'Forgot Password'}
                        subTitle={'Enter your email for the verification process, we will send 4 digits code to your email.'}/>
                        <div>
                            <label htmlFor="email" className='mail'>Email</label>
                            <Field type="email" name="email"  className='put'   placeholder="Entrez votre email" />
                            </div>
                        
                        <div className='button'>
                         <button  className='start' type="submit">Continue</button>
                         <button className='emailButton'>Sign up with Google</button>
                         </div>
                         <Msglink
                           direction="/Account"
                            msg="don't have an account?"
                            destination="Sigin in"/>
                         </div>
               <ToastContainer/>
                    </Form>
                )}
            </Formik>
           
            </div>
       
    )
}
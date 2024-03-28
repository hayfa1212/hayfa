
import * as React from 'react'
import {
    Formik,
    Form,
    Field,
    ErrorMessage
} from 'formik'
import * as Yup from 'yup'
import supabase from '../../utils/api'
import { ToastContainer, toast } from 'react-toastify'
import Logo from '../../Components/siginCommun/logoSigin'
import Title from '../../Components/siginCommun/title'
import Msglink from '../../Components/siginCommun/sigincommun'



interface MyFormValues {
    password: string
    confirm: string
}

export const Resetpass: React.FC<{}> = () => {
    const initialValues: MyFormValues = { password: '',confirm: ''};

     return (
        <div>
        
           
            <div className='interface'>
            <Formik
                initialValues={initialValues}
                validationSchema={Yup.object().shape({
             password: Yup.string().min(8, 'Le mot de passe doit comporter au maximum 8 caractères.') .required(''),
              confirm: Yup .string() .oneOf([Yup.ref("password"),], "Passwords must match") .required("Required"),
                    })}
                    onSubmit={async(values) => {
                        console.log('form submit', values);
                        const { data, error } = await supabase.auth.updateUser({
                            password: values.password
                        });
                        if (error) {
                            toast.error('An error occurred while updating the password');
                        } else {
                            toast.success('Password updated successfully');
                        }
                    }}
                    
            >
                        {({ errors, touched }) => (

                    
                    <Form  className='login'>
                     <Logo/>
                     <div className='formLogin'> 
                       <Title
                        title={'Reset Password'}
                        subTitle={'Set the new password for your account so you can login and access all features.'}/>
                        <div>
                            <label htmlFor="password" className='password'>Password</label>
                            <Field type="password" name="password" className='put'  placeholder="" />
                            {errors.password && <p className='erreurMsg'>{errors?.password}</p>}
                           
                            <label htmlFor="confirm" >Confirm Password</label>
                            <Field type="password" name="confirm" className='put'  placeholder="" />
                            {errors.confirm && <p className='erreurMsg'>{errors?.confirm}</p>}
                        </div>
                        <div >
                        <div >
                         <button  className="start" type="submit">Update Password</button>
                         </div>
                        
                         <Msglink  direction="/Account"
                            msg="don't have an account?"
                           destination="Sigin in"/>
                         </div>
                         </div>
                       
                    </Form>
                    
                )} 
                 
            </Formik>
           
            </div>
            <ToastContainer/>
        </div>
    )
}
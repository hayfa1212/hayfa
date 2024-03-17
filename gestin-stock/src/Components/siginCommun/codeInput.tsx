import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './codeInput.css'



export const Code: React.FC<{}>= () => {
  const initialValues = {
      codePut: '',
     
  };

  return (
      <div>
          <Formik
              initialValues={initialValues}
              validationSchema={Yup.object().shape({
                  codePut: Yup.string().max(1),
                  
              })}
              onSubmit={(values) => {
                  console.log('form submit', values);
              }}
          >
             {({ errors, touched }) => (
                    <Form>


                        <div>
                          
                          <Field name="text" className='codePut' maxLength={1} />
                          </div>
                          
                      
                    </Form>
                )}
             
          </Formik>
      </div>
  );
};

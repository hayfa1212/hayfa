import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import supabase from "../../utils/api";
import { toast } from "react-toastify";
import "./ajoutEntrepot.css"

interface Store {
  name: string;
  location: string;
  number: number;
  description: string;
}

const initialValues: Store = {
  name: "",
  location: "",
  number: 0,
  description: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  number: Yup.number(),
  description: Yup.string(),
});

interface AjoutentrepottProps {
  isOpen: boolean;
  onClose: () => void;
}

const Addstore: React.FC<AjoutentrepottProps> = ({ isOpen, onClose }) => {
  const handleLogin = async (values: Store) => {
    try {
      const { data, error } = await supabase.from("entrepot").insert([
        {
          name: values.name,
          location: values.location,
          Number: values.number,
          description: values.description,
        },
      ]);
      if (!error) {
        toast.success('Success');
        onClose(); // Ferme le modal après une soumission réussie
      } else {
        toast.error('Error occurred while adding store');
      }
    } catch (error) {
      console.error('Error occurred while adding store:', error);
      toast.error('An error occurred while adding store');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="modal" >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => handleLogin(values)}
            >
              {({ errors, touched }) => (
                <Form>
                  <div>
                    <label htmlFor="name">Name</label>
                    <Field type="text" id="name" name="name" />
                    {errors.name && touched.name && <div>{errors.name}</div>}
                  </div>

                  <div>
                    <label htmlFor="location">Location</label>
                    <Field type="text" id="location" name="location" />
                    {errors.location && touched.location && (
                      <div>{errors.location}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="number">Number</label>
                    <Field type="number" id="number" name="number" />
                    {errors.number && touched.number && (
                      <div>{errors.number}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description">Description</label>
                    <Field type="text" id="description" name="description" />
                    {errors.description && touched.description && (
                      <div>{errors.description}</div>
                    )}
                  </div>

                  <div className="modal-buttons">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default Addstore;

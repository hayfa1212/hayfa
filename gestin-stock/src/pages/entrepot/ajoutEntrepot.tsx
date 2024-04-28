import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

interface Store {
  name: string;
  location: string;
  number: number;
  description: string;
  capacite:number;
  image: File | null; // Ajout du champ pour l'image
}

const initialValues: Store = {
  name: "",
  location: "",
  number: 0,
  description: "",
  capacite:0,
  image: null, // Initialiser à null
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  location: Yup.string().required("Required"),
  number: Yup.number(),
  description: Yup.string(),
  capacite:Yup.number(),
  image: Yup.mixed().notRequired(), // Rendre l'ajout de l'image facultatif
});

interface AddStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStore: React.FC<AddStoreProps> = ({ isOpen, onClose }) => {
  const handleSubmit = async (values: Store) => {
    try {
      let imageUrl: string | null = null; // Définir imageUrl à null par défaut

      // Vérifier si une image a été sélectionnée
      if (values.image) {
        // Envoi de l'image
        const imageFile = values.image;
        const fileName = `store-${Date.now()}-${imageFile?.name}`;

        const { data: imageUploadData, error: imageUploadError } = await supabase.storage
          .from("imagestore")
          .upload(fileName, imageFile);

        if (imageUploadError) {
          throw new Error("Error uploading image");
        }

        // Récupération de l'URL de l'image téléchargée
        const response = await supabase.storage.from("imagestore").getPublicUrl(fileName);
        imageUrl = response.data.publicUrl;
      }

      // Enregistrement des autres informations dans la base de données avec l'URL de l'image si disponible
      const { data, error } = await supabase.from("entrepot").insert([
        {
          name: values.name,
          location: values.location,
          Number: values.number,
          description: values.description,
          capacite:values.capacite,
          image: imageUrl, // Utilisation de l'URL de l'image si disponible, sinon null
        },
      ]);

      if (!error) {
        toast.success("Store added successfully!");
        onClose(); // Fermer la modal après soumission réussie
      } else {
        toast.error("Failed to add store");
      }
    } catch (error) {
      console.error("Error adding store:", error);
      toast.error("An error occurred while adding store");
    }
  };

  return (
    <>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel="Add Store Modal"
          style={{
            content: {
              width: "25rem",
              height: "25rem",
              marginLeft: "25rem",
            },
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form className="form">
                <p id="attribute">Add Store</p>
                <div className="User">
                  <label htmlFor="image">Image</label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      if (event.currentTarget.files) {
                        setFieldValue("image", event.currentTarget.files[0]);
                      }
                    }}
                  />
                  {errors.image && touched.image && (
                    <div>{errors.image}</div>
                  )}
                </div>
                <div className="User">
                  <label htmlFor="name">Store Name</label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="columnUser"
                    placeholder="Enter store name"
                  />
                  {errors.name && touched.name && <div>{errors.name}</div>}
                </div>

                <div className="User">
                  <label htmlFor="location">Location</label>
                  <Field
                    type="text"
                    id="location"
                    name="location"
                    className="columnUser"
                    placeholder="Enter store location"
                  />
                  {errors.location && touched.location && (
                    <div>{errors.location}</div>
                  )}
                </div>

                <div className="User">
                  <label htmlFor="number">Number</label>
                  <Field
                    type="number"
                    id="number"
                    name="number"
                    className="columnUser"
                    placeholder="Enter store number"
                  />
                  {errors.number && touched.number && (
                    <div>{errors.number}</div>
                  )}
                </div>
                <div className="User">
                  <label htmlFor="number">Capacite</label>
                  <Field
                    type="number"
                    id="capacite"
                    name="capacite"
                    className="columnUser"
                    placeholder="Enter store capacite"
                  />
                  {errors.number && touched.number && (
                    <div>{errors.number}</div>
                  )}
                </div>

                <div className="User">
                  <label htmlFor="description">Description</label>
                  <Field
                    type="text"
                    id="description"
                    name="description"
                    className="columnUser"
                    placeholder="Enter store description"
                  />
                  {errors.description && touched.description && (
                    <div>{errors.description}</div>
                  )}
                </div>

                <div className="btnUser">
                  <button type="button" onClick={onClose} className="cancel">
                    Cancel
                  </button>
                  <button type="submit" className="add">
                    Add Store
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default AddStore;

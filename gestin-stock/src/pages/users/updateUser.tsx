import React, { useState } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// Importez votre configuration Supabase
import "./update.css";
import supabase from "../../utils/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone: number;
  role: string;
  image: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.number().typeError("Phone must be a number").required("Phone is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (values: User) => {
    if (image) {
      setUploading(true);

      // Téléchargement de l'image vers Supabase Storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from('test')
        .upload(`${image.name}`, image);

      if (fileError) {
        console.error('Error uploading image to Supabase Storage:', fileError.message);
        return;
      }
      const response = await supabase.storage
      .from("test") // Assurez-vous que c'est bien le conteneur que vous utilisez pour le stockage
      .getPublicUrl(`user_images/${image.name}`);
      const imageUrl = response.data.publicUrl;
    
      // Mettre à jour la base de données Supabase avec l'URL de l'image
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({ image: imageUrl })
        .eq('id', values.id);

      if (userError) {
        console.error('Error updating user image:', userError.message);
      } else {
        console.log('User image updated successfully');
      }

      setUploading(false);

      onUpdate({ ...values, image: imageUrl });
    } else {
      onUpdate(values);
    }
  };

  return (
    <Modal
      className="modals"
      isOpen={isOpen}
      onRequestClose={onClose}
    >
      <Formik
        initialValues={user}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        <Form className="space">
          <p className="head" id="newUser">Edit User</p>
          <div className="User">
            <label htmlFor="name" id="attribute">Name:</label>
            <Field type="text" id="name" name="name" className="columnUser" />
            <ErrorMessage name="name" component="div" className="error" />
          </div>
          <div className="User" id="dis">
            <label htmlFor="email" id="attribute">Email:</label>
            <Field type="email" id="email" name="email" className="columnUser" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div className="User">
            <label htmlFor="phone" id="attribute">Phone:</label>
            <Field type="text" id="phone" name="phone" className="columnUser" />
            <ErrorMessage name="phone" component="div" className="error" />
          </div>
          <div className="User">
            <label htmlFor="role" id="attribute">Role</label>
            <Field as="select" id="role" name="role" className="columnUser" placeholder="Select Role">
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="responsable stock">Responsable stock</option>
              <option value="responsable logistique">Responsable logistique</option>
            </Field>
            <ErrorMessage name="role" component="div" className="error" />
          </div>
          <div className="User">
            <label htmlFor="image" id="attribute">Image:</label>
            <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
            <ErrorMessage name="image" component="div" className="error" />
          </div>
          <div className='buttons'>
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
            <button type="submit" className='add'>{uploading ? "Updating..." : "Update"}</button>
          </div>
        </Form>
      </Formik>
    </Modal>
  );
};

export default EditUserModal;

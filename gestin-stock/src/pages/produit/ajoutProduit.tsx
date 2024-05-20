import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal'
import supabase from "../../utils/api";
import './ajoutProduit.css';

interface Supplier {
  id: number;
  name: string;
}

interface Warehouse {
  id: number;
  name: string;
}

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
  idSupp: number;
  idWarehouse: number;
  image: string; 
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
  idSupp: 0,
  idWarehouse: 0,
  image: "", 
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  id: Yup.number().typeError("you should put numbre").required("Required"),
  category: Yup.string().required("Required"),
  quantity: Yup.number().typeError("you should put numbre"),
  unit: Yup.string(),
  expire: Yup.date(),
  thershold: Yup.number().typeError("you should put numbre"),
 
});

interface AjoutproduitProps {
  isOpen: boolean;
  onClose: () => void;
}

const Ajoutproduit: React.FC<AjoutproduitProps> = ({ isOpen, onClose }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const { data, error } = await supabase.from('supplier').select('*');
        if (error) {
          throw error;
        }
        setSuppliers(data as Supplier[]);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching suppliers.');
      }
    };
    fetchSuppliers();

    const fetchWarehouses = async () => {
      try {
        const { data, error } = await supabase.from('entrepot').select('*');
        if (error) {
          throw error;
        }
        setWarehouses(data as Warehouse[]);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching warehouses.');
      }
    };
    fetchWarehouses();
  }, []);

  const handleLogin = async (values: Product) => {
    try {
      let imageUrl = "";
      if (imageFile) {
        const { data, error } = await supabase.storage.from("imageprod").upload(values.name, imageFile);
        if (error) {
          throw error;
        }
        const response = await supabase.storage.from("imageprod").getPublicUrl(values.name);
        imageUrl = response.data.publicUrl;
      }

      const { data, error } = await supabase.from('product').insert([
        { 
          product_Name: values.name,
          id: values.id,
          Category: values.category,
          buying_price: values.price,
          quantity: values.quantity,
          unit: values.unit,
          expire: values.expire,
          thershold: values.thershold,
          availibilty: values.quantity > 0 ? "in-stock" : "Out of stock",
          supplier_id: values.idSupp,
          idStore: values.idWarehouse,
          image: imageUrl 
        },
      ]);

      console.log(data);

      if (!error) {
        toast.success('Success');
      }
    } catch (error) {
      console.error(error);
      toast.error(' product exist.');
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
              <p id="newUser">New Product</p>
              <div className="column">
                <input
                  id="image"
                  name="image"
                  className="drag"
                  type="file"
                  onChange={(event) => {
                    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
                      setImageFile(event.currentTarget.files[0]);
                    }
                  }}
                />
              </div>
              <div className="column">
                <label htmlFor='name' id="attribute">Product Name</label>
                <Field type='text' id='name' name='name' className="columnUser" placeholder="Enter Product Name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='id' id="attribute">Product ID</label>
                <Field type='float' id='id' name='id' className="columnUser" placeholder="Enter Product Name" />
                <ErrorMessage name="id" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='category'>Category</label>
                <Field type='text' id='category' name='category' className="columnUser"  placeholder="Enter Product Category"/>
                <ErrorMessage name="category" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='price'> Buying Price</label>
                <Field type='float' id='price' name='price' className="columnUser" placeholder="Enter Buying Price" />
                <ErrorMessage name="price" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='quantity'>Quantity</label>
                <Field type='float' id='quantity' name='quantity'className="columnUser"  placeholder="ENter Product quantity" onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = e.target;
                  setFieldValue('quantity', value);
                  setFieldValue('availability', parseInt(value) > 0 ? "In stock" : "Out of stock");
                }} />
                <ErrorMessage name="quantity" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='unit'>Unit</label>
                <Field type='text' id='unit' name='unit' className="columnUser"  placeholder="Enter Product unit"/>
                <ErrorMessage name="unit" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='expire'>Expiry Date</label>
                <Field type='date' id='expire' name='expire' className="columnUser" placeholder="Enter expiry date" />
                <ErrorMessage name="expire" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='thershold'>Thershold Value</label>
                <Field type='float' id='thershold' name='thershold' className="columnUser" placeholder="Enter thershold value" />
                <ErrorMessage name="thershold" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='idSupp'>Supplier</label>
                <Field as="select" id='idSupp' name='idSupp' className="columnUser">
                  <option value="">Select Supplier</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="idSupp" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='idWarehouse'>Warehouse</label>
                <Field as="select" id='idWarehouse' name='idWarehouse' className="columnUser">
                  <option value="">Select Warehouse</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                  ))}
                </Field>
                <ErrorMessage name="idWarehouse" component="div" className="error" />
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

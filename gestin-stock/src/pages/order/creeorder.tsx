import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import Modal from 'react-modal';
import supabase from "../../utils/api";

interface Commande {
  product: string;
  id: number;
  category: string;
  orderValue: number;
  quantity: number;
  unit: string;
  buyingPrice: number;
  dateDelivery: string;
  type:string;
  stauts:string;
  idProduct:number;
}

const initialValues: Commande = {
  product: "",
  id: 0,
  category: "",
  orderValue: 0,
  quantity: 0,
  unit: "",
  buyingPrice: 0,
  dateDelivery: "",
  type:"",
  stauts: "Pending",
  idProduct:0,
};

const validationSchema = Yup.object({
  product: Yup.string().required("Required"),
  id: Yup.number().required("Required"),
  category: Yup.string().required("Required"),
  orderValue: Yup.number(),
  quantity: Yup.number(),
  unit: Yup.string(),
  buyingPrice: Yup.number(),
  dateDelivery: Yup.date(),
  type:Yup.string(),
  status:Yup.string()
});

interface AjoutCommandeProps {
  isOpen: boolean;
  onClose: () => void;
}

const AjoutCommande: React.FC<AjoutCommandeProps> = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('product')
          .select('Category');

        if (data) {
          const uniqueCategories = Array.from(new Set(data.map((item: any) => item.Category)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);
  
  const handleAddCommande = async (values: Commande) => {
    try {
      const productData = await supabase
        .from('product')
        .select('quantity,id')
        .eq('product_Name', values.product)
        .single();

        if (productData && productData.data) {
          const currentQuantity = productData.data.quantity;
          let newQuantity;
        
          if (values.type === "Client") {
            newQuantity = currentQuantity - values.quantity;
          } else {
           
            newQuantity = currentQuantity + values.quantity;
          }
        
          if (newQuantity < 0 && values.type === "Client") {
            toast.error('The order exceeds stock.');
            return;
          }

        await supabase
          .from('product')
          .update({ quantity: newQuantity })
          .eq('product_Name', values.product);
         


        const { data, error } = await supabase.from('commande').insert([
          { 
            product: values.product,
            id: values.id, 
            category: values.category,
            price: values.buyingPrice,
            quantity: values.quantity,
            unit: values.unit,
            orderValue: values.buyingPrice * values.quantity,
            dateDelivery: values.dateDelivery,
            type:values.type,
            status:values.stauts,
           idProduct:productData.data.id,
          },
        ]);

        console.log( values);
        toast.success('Order added successfully');
      } else {
        toast.error('Product not found in stock');
      }
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de l\'ajout de la commande');
    }
  };
  

  return (
  
       <Modal  isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}  style={{content: {width: '25rem', height: '30rem', marginLeft: '25rem'}}}>
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => handleAddCommande(values)}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="form">
              <p id="newUser">New Order</p>
              <div className="column">
                <label htmlFor='product' id="attribute">Product Name</label>
                <Field type='text' id='product' name='product' className="columnUser" placeholder="Enter product name" />
                <ErrorMessage name="product" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='id' id="attribute">order ID</label>
                <Field type='number' id='id' name='id' className="columnUser" placeholder="Enter the order ID" />
                <ErrorMessage name="id" component="div" className="error" />
              </div>
              <div className="column">
            <label htmlFor="type">Type Order</label>
             <Field as="select" id="type" name="type" className="columnUser">
             <option value="">Select Type</option>
             <option value=" Supplier">Supplier</option>
             <option value="Client">Client</option>
            </Field>
          {errors.type && touched.type && (
             <div>{errors.type}</div>
              )}
             </div>
              <div className="column">
                <label htmlFor='category'>Category</label>
                <Field as="select" id="category" name="category" className="columnUser">
                  <option value="">Select Product Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='orderValue'>Order Value</label>
                <Field type='float' id='orderValue' name='orderValue' className="columnUser" placeholder="Enter order value" />
                <ErrorMessage name="orderValue" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='quantity'>Quantity</label>
                <Field type='number' id='quantity' name='quantity'className="columnUser"  placeholder="Enter quantity" />
                <ErrorMessage name="quantity" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='unit'>Unite</label>
                <Field type='text' id='unit' name='unit' className="columnUser"  placeholder="Enter unit"/>
                <ErrorMessage name="unit" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='buyingPrice'> Buying Price</label>
                <Field type='number' id='buyingPrice' name='buyingPrice' className="columnUser" placeholder="Enter purchase price" />
                <ErrorMessage name="buyingPrice" component="div" className="error" />
              </div>
              <div className="column">
                <label htmlFor='dateDelivery'>Date of delivery</label>
                <Field type='date' id='dateDelivery' name='dateDelivery' className="columnUser" placeholder="Enter the delivery date" />
                <ErrorMessage name="dateDelivery" component="div" className="error" />
              </div>
            
              <div className='buttons'>
                <button type='button' onClick={onClose} className="cancel">Cancel</button>
                <button type='submit' className='add'>Add Order</button>
              </div>
              <ToastContainer />
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
    
   
  );
};

export default AjoutCommande;

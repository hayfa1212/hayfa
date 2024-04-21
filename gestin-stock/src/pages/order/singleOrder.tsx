import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import supabase from "../../utils/api";
import "./singleorder.css";
import notif from "../../Assets/notification.png";
import { ToastContainer, toast } from "react-toastify";

const productSchema = Yup.object().shape({
  quantity: Yup.number().typeError("You should put a number"),
  price: Yup.number().typeError("You should put a number"),
  status: Yup.string(),
});


interface Product {
  id: number;
  product_Name: string;
  Category: string;
  buying_price: number;
  thershold: number;
  expire: string;
  quantity: number;
  availibilty: string;
  image: string;
  supplier_id: number;
  idStore: number;
}

interface Supplier {
  id: number;
  name: string;
  contact: string;
}

interface Warehouse {
  id: number;
  name: string;
}

interface Commande {
  id: number;
  product: string;
  category: string;
  orderValue: number;
  quantity: number;
  unit: string;
  price: number;
  dateDelivery: string;
  status: string;
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [commande, setCommande] = useState<Commande | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Commande | {}>({});
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const fetchCommande = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from("commande")
          .select()
          .eq("id", parseInt(orderId, 10));

        if (!error && data && data.length > 0) {
          setCommande(data[0]);
        } else {
          console.error("Commande not found");
        }
      } catch (error) {
        console.error("Error fetching commande:", error);
      }
    };

    fetchCommande();
  }, [orderId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!commande) return;

      try {
        const { data, error } = await supabase
          .from("product")
          .select()
          .eq("product_Name", commande.product);

        if (!error && data && data.length > 0) {
          setProduct(data[0]);
          setEditedOrder(data[0]);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [commande]);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!product) return;

      try {
        const { data, error } = await supabase.from("supplier").select();

        if (!error && data) {
          setAllSuppliers(data);
          const selectedSupplier = data.find((s) => s.id === product.supplier_id);
          setSupplier(selectedSupplier || null);
        } else {
          console.error("Error fetching suppliers:", error);
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSupplier();
  }, [product]);

  useEffect(() => {
    const fetchWarehouse = async () => {
      if (!product || !product.idStore) return;

      try {
        const { data, error } = await supabase.from("entrepot").select().eq("id", product.idStore);

        if (!error && data && data.length > 0) {
          setWarehouse(data[0]);
        } else {
          console.error("Warehouse not found");
        }
      } catch (error) {
        console.error("Error fetching warehouse:", error);
      }
    };

    fetchWarehouse();
  }, [product]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
  setIsEditing(false);
  try {
    // Validate the edited order using the productSchema
    await productSchema.validate(editedOrder as Commande, { abortEarly: false });
    
    // Update the commande data in the database
    const { error } = await supabase
      .from("commande")
      .update({
        quantity: (editedOrder as Commande).quantity,
        price: (editedOrder as Commande).price,
        status: (editedOrder as Commande).status,
      })
      .eq("id", commande?.id);

    // Check for errors during the update operation
    if (!error) {
      console.log("Commande updated successfully");
      toast.success('updated successfully')
      // Update the local state with the edited status
      if (commande) {
        setCommande((prevCommande) => ({
          ...prevCommande!,
          status: (editedOrder as Commande).status,
        }));
      }
    } else {
      console.error("Error updating commande:", error.message);
    }
  } catch (error) {
    console.error("Validation error:", error);
    if (error instanceof Yup.ValidationError) {
      const newErrors: Record<string, string> = {}; // Typage explicite
      error.inner.forEach((err) => {
        // Process validation errors if needed
      });
      setErrors(newErrors);
    }
  }
};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: name === "quantity" ? parseInt(value, 10) : value,
    }));
  };

  if (!commande || !product || !supplier || !warehouse) {
    return <div>Loading...</div>;
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="searchBar">
        <input type="search" className="search" placeholder="Search" />
        <img src={notif} className="notif" alt="Notification" />
      </div>

      <div className="change">
        <div className="titre">
          {product && (
            <>
              <p className="prods">{product.product_Name}</p>
              <div className="bttn">
                {isEditing ? (
                  <button className="btn" onClick={handleSaveClick}>Save</button>
                ) : (
                  <button className="btn" onClick={handleEditClick}>Edit</button>
                )}
                <button className="btn">Download all</button>
              </div>
            </>
          )}
        </div>

        <div className="left">
          <div className="over">
            <p>Overview</p>
            <p>Purchases</p>
            <p>Adjustments</p>
            <p>History</p>
          </div>
          <p className="ligne" id="lign"></p>
        </div>

        <div className="order">
          <div className="detailsprod">
            <div className="detailproduct">
              <p className="detail">Primary Details</p>
              <div className="columns">
                <p id="titre">Product Name</p>
                <p id="valeur">{product.product_Name}</p>
              </div>
              <div className="columns">
                <p id="titre">Product ID:</p>
                <p id="valeur">{product.id}</p>
              </div>
              <div className="columns">
                <p id="titre">Product Category:</p>
                <p id="valeur">{product.Category}</p>
              </div>
              <div className="columns">
                <p id="titre">Expiry Date: </p>
                <p id="valeur">{product.expire}</p>
              </div>
              <p className="detail">Supplier Details</p>
              <div className="columns">
                <p id="titre">Supplier Name</p>
                <p id="valeur">{supplier.name}</p>
              </div>
              <div className="columns">
                <p id="titre">Supplier Contact</p>
                <p id="valeur">{supplier.contact}</p>
              </div>
              <p className="detail">Stock Location</p>
              <div className="columns">
                <p id="titre">Store Name</p>
                <p id="valeur">{warehouse.name}</p>
              </div>
            </div>

            <div className="Order">
              <div>{product.image && <img src={product.image} alt="Product" className="produitimg" />}</div>
              <div className="orderDetails">
                <p className="detail">Order Details</p>
                <div className="columns">
                  <p id="titre">Order Value</p>
                  <p id="valeur">{commande.orderValue}</p>
                </div>
                <div className="columns">
                  <p id="titre">Quantity: </p>
                  {isEditing ? (
                    <input type="text" id="valeur" name="quantity" value={(editedOrder as Commande).quantity} onChange={handleInputChange} />
                  ) : (
                    <p id="valeur">{commande.quantity}</p>
                  )}
                </div>
                <div className="columns">
                  <p id="titre">Buying Price: </p>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        id="valeur"
                        name="buyingPrice"
                        value={(editedOrder as Commande).price}
                        onChange={handleInputChange}
                      />
                      {errors.buyingPrice && <div className="error">{errors.buyingPrice}</div>}
                    </div>
                  ) : (
                    <p id="valeur">{commande.price}</p>
                  )}
                </div>
                <div className="columns">
                  <p id="titre">Status:</p>
                  {isEditing ? (
                     <select
                     id="valeur"
                     name="status"
                     value={(editedOrder as Commande).status}
                     onChange={handleSelectChange} // Utilisez la fonction handleSelectChange pour les sélecteurs
                   >
                     <option value="Delayed" >Delayed</option>
                     <option value="Returned">Returned</option>
                     <option value="Confirmed" >Confirmed</option>
                   </select>
                  ) : (
                    <p
                    id="valeur"
                    style={{ color: commande.status === 'Confirmed' ? '#1366D9' : (commande.status === 'Delayed' ? '#F79009' : '') }}
                  >
                    {commande.status}
                  </p>
                  
                  )}
                </div>
                <ToastContainer/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup"; // Import de Yup
import supabase from "../../utils/api";
import "./singleProd.css";
import edit from "../../Assets/edition.png";
import notif from "../../Assets/notification.png";
import { ToastContainer, toast } from "react-toastify";
import jsPDF from 'jspdf'; 

// Définition du schéma de validation avec Yup
const productSchema = Yup.object().shape({
  product_Name: Yup.string().required("Product name is required"),
  Category: Yup.string().required("Category is required"),
  buying_price: Yup.number().typeError("you should put numbre").required("Buying price is required"),
  thershold: Yup.number().typeError("you should put numbre").required("Threshold value is required"),
  expire: Yup.string().required("Expiry date is required"),
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
  supplier_id: number; // Clé étrangère
  idStore: number; // Clé étrangère pour l'entrepôt
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


const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [errors, setErrors] = useState<any>({}); // State pour stocker les erreurs de validation

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const { data, error } = await supabase
          .from("product")
          .select()
          .eq("id", parseInt(productId, 10));

        if (!error && data && data.length > 0) {
          setProduct(data[0]);
          setEditedProduct(data[0]); // Set edited product initially with fetched data
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

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
    if (editedProduct && product) {
      try {
        await productSchema.validate(editedProduct); // Valider le produit édité avant la sauvegarde
        const { error } = await supabase.from("product").update(editedProduct).eq("id", product.id);

        if (!error) {
          toast.success("Product updated successfully");
          setProduct(editedProduct);
        } else {
          console.error("Error updating product:", error.message);
        }
      } catch (error) {
        console.error("Validation error:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct: Product | null) => {
      if (prevProduct) {
        return {
          ...prevProduct,
          [name]: name === "buying_price" ? parseFloat(value) : name === "id" ? parseInt(value, 10) : value,
        };
      }
      return null;
    });

    // Valider les données saisies à mesure qu'elles sont modifiées
    productSchema
      .validateAt(name, { [name]: value })
      .then(() => {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [name]: null,
        }));
      })
      .catch((err) => {
        setErrors((prevErrors: any) => ({
          ...prevErrors,
          [name]: err.message,
        }));
      });

    // Si le champ modifié est l'ID, mettre à jour également l'ID du produit original
    if (name === "id" && product) {
      setProduct((prevProduct: Product | null) => {
        if (prevProduct) {
          return {
            ...prevProduct,
            id: parseInt(value, 10),
          };
        }
        return null;
      });
    }
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSupplierId = parseInt(e.target.value, 10);
    setEditedProduct((prevProduct: Product | null) => {
      if (prevProduct) {
        return {
          ...prevProduct,
          supplier_id: selectedSupplierId,
        };
      }
      return null;
    });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const downloadProductDetails = () => {
    if (!product) return;
  
    // Créer une instance de jsPDF
    const doc = new jsPDF();
      // Ajouter l'image du produit au PDF
    if (product.image) {
      const imgData = product.image; // Supposons que product.image contient l'URL de l'image
      doc.addImage(imgData, "JPEG", 10, 40, 50, 50); // Position et taille de l'image dans le PDF
    }
  
    // Générer le contenu du PDF avec les détails du produit
    let content = "";
    content += `Product Name: ${product.product_Name}\n`;
    content += `Product ID: ${product.id}\n`;
    content += `Product Category: ${product.Category}\n`;
    content += `Buying Price: ${product.buying_price}\n`;
    content += `Threshold Value: ${product.thershold}\n`;
    content += `Expiry Date: ${product.expire}\n`;
  
    // Ajouter le contenu au PDF
    doc.text(content, 10, 10);
  
  
   
    // Enregistrer le PDF
    doc.save("product_details.pdf");
  };
  
  return (
    <div>
      
      <div className="searchBar">
        <input type="search" className="search" placeholder="Search" />
        <img src={notif} className="notif" />
      </div>
      <div className="changes">
        <div className="titre">
          <p className="prods"> {product.product_Name}</p>
          <div className="bttn">
            {isEditing ? (
              <button className="btn" onClick={handleSaveClick}>
                Save
              </button>
            ) : (
              <button className="btn" onClick={handleEditClick}>
                <img src={edit} className="imgedit" />
                Edit
              </button>
            )}
            <button className="btn" onClick={downloadProductDetails}>Download all</button>
          </div>
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
      
        <div className="cadre">
          <div>
          <p className="detail">Primary Details</p>
            <div className="columns">
              <p id="titre">Product Name</p>
              {isEditing ? (
                <div>
                <input
                  type="text"
                  id="valeur"
                  name="product_Name"
                  value={editedProduct ? editedProduct.product_Name : ""}
                  onChange={handleInputChange}
                  className="columnUser"
                  
                />
                 {errors.product_Name && <div className="error" >{errors.product_Name}</div>}
                </div>
                
              ) : (
                <p id="valeur"> {product.product_Name}</p>
              )}
            </div>
            <div className="columns">
              <p id="titre">Product ID:</p>
              {isEditing ? (
                <div>
                <input
                  type="float"
                  id="valeur"
                  name="id"
                  value={editedProduct ? editedProduct.id : ""}
                  onChange={handleInputChange}
                  className="columnUser"
                />
                  {errors.id && <div className="error" >{errors.id}</div>}
                </div>
              ) : (
                <p id="valeur"> {product.id}</p>
              )}
            </div>

            <div className="columns">
              <p id="titre">Product Category:</p>
              {isEditing ? (
                <div>
                <input
                  type="text"
                  id="valeur"
                  name="Category"
                  value={editedProduct ? editedProduct.Category : ""}
                  onChange={handleInputChange}
                  className="columnUser"
                />
                  {errors.Category  && <div className="error" >{errors.Category }</div>}
                </div>
              ) : (
                <p id="valeur"> {product.Category}</p>
              )}
            </div>
            <div className="columns">
              <p id="titre">Buying Price</p>
              {isEditing ? (
                <div>
                <input
                  type="float"
                  id="valeur"
                  name="buying_price"
                  value={editedProduct ? editedProduct.buying_price : ""}
                  onChange={handleInputChange}
                  className="columnUser"
                />
                 {errors.buying_price  && <div className="error" >{errors.buying_price }</div>}
                </div>
              ) : (
                <p id="valeur"> {product.buying_price}</p>
              )}
            </div>
            <div className="columns">
              <p id="titre">Threshold Value</p>
              {isEditing ? (
                <div>
                <input
                  type="float"
                  id="valeur"
                  name="thershold"
                  value={editedProduct ? editedProduct.thershold : ""}
                  onChange={handleInputChange}
                  className="columnUser"
                />
                  {errors.thershold  && <div className="error" >{errors.thershold }</div>}
                </div>
              ) : (
                <p id="valeur">{product.thershold}</p>
              )}
            </div>
            <div className="columns">
              <p id="titre">Expiry Date: </p>
              {isEditing ? (
                <div>
                <input
                  type="text"
                  id="valeur"
                  name="expire"
                  value={editedProduct ? editedProduct.expire : ""}
                  onChange={handleInputChange}
                  className="columnUser"
                />
                {errors.expire  && <div className="error" >{errors.expire  }</div>}
                </div>
              ) : (
                <p id="valeur">{product.expire}</p>
              )}
            </div>

            {allSuppliers && (
          <div>
            <p className="detail">Supplier Details</p>
            <div className="columns">
              <p id="titre">Supplier Name</p>
              {isEditing ? (
                <select
                  id="valeur"
                  name="supplier_id"
                  value={editedProduct ? editedProduct.supplier_id : ""}
                  onChange={handleSupplierChange}
                  className="columnUser"
                >
                  <option value="">Select Supplier</option>
                  {allSuppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p id="valeur"> {supplier?.name}</p>
              )}
            </div>
            {/* Affichage du contact du fournisseur */}
            <div className="columns">
              <p id="titre">Contact</p>
              <p id="valeur"> {supplier?.contact}</p>
            </div>
          </div>
        )}

        {warehouse && (
          <div>
            <p className="detail">Stock Location</p>
            <div className="columns">
              <p id="valeur"> {warehouse.name}</p>
            </div>
          </div>
        )}

          </div>
          <div>{product.image && <img src={product.image} alt="Product" className="produitimg" />}</div>
        </div>

       <ToastContainer/>
      </div>
    </div>
  );
};

export default ProductDetails;

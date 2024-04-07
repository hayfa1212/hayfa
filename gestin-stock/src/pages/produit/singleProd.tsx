import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/api";
import "./singleProd.css";
import edit from "../../Assets/edition.png";
import notif from '../../Assets/notification.png'

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

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            try {
                const { data, error } = await supabase
                    .from('product')
                    .select()
                    .eq('id', parseInt(productId, 10));

                if (!error && data && data.length > 0) {
                    setProduct(data[0]);
                    setEditedProduct(data[0]); // Set edited product initially with fetched data
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    useEffect(() => {
        const fetchSupplier = async () => {
            if (!product) return;

            try {
                const { data, error } = await supabase
                    .from('supplier')
                    .select();

                if (!error && data) {
                    setAllSuppliers(data);
                    const selectedSupplier = data.find(s => s.id === product.supplier_id);
                    setSupplier(selectedSupplier || null);
                } else {
                    console.error('Error fetching suppliers:', error);
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSupplier();
    }, [product]);

    useEffect(() => {
        const fetchWarehouse = async () => {
            if (!product || !product.idStore) return;

            try {
                const { data, error } = await supabase
                    .from('entrepot')
                    .select()
                    .eq('id', product.idStore);

                if (!error && data && data.length > 0) {
                    setWarehouse(data[0]);
                } else {
                    console.error('Warehouse not found');
                }
            } catch (error) {
                console.error('Error fetching warehouse:', error);
            }
        };

        fetchWarehouse();
    }, [product]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        setIsEditing(false);
        if (editedProduct && product) { // Check if both editedProduct and product are not null
            try {
                const { error } = await supabase
                    .from('product')
                    .update(editedProduct)
                    .eq('id', product.id); // Utilize the original product ID for update

                if (!error) {
                    console.log('Product updated successfully');
                    setProduct(editedProduct); // Update product state with edited product
                } else {
                    console.error('Error updating product:', error.message);
                }
            } catch (error) {
                console.error('Error updating product:', error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedProduct((prevProduct: Product | null) => {
            if (prevProduct) {
                return {
                    ...prevProduct,
                    [name]: name === 'buying_price' ? parseFloat(value) : name === 'id' ? parseInt(value, 10) : value,
                };
            }
            return null;
        });

        // Si le champ modifié est l'ID, mettre à jour également l'ID du produit original
        if (name === 'id' && product) {
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

    // Render
    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="searchBar">
                <input 
                    type="search"
                    className="search"
                    placeholder="Search"   
                /> 
                <img src={notif} className="notif"/>
            </div>
            <div className="change">
                <div className="titre">
                    <p className="prods"> {product.product_Name}</p>
                    <div className="bttn">
                        {isEditing ? (
                            <button className="btn" onClick={handleSaveClick}>Save</button>
                        ) : (
                            <button className="btn" onClick={handleEditClick}>
                                <img src={edit} className="imgedit"/>Edit
                            </button>
                        )}
                        <button className="btn">Download all</button>
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
                <p className="detail">Primary Details</p>
                <div className="cadre"> 
                    <div>
                        <div className="columns">
                            <p id="titre">Product Name</p>
                            {isEditing ? (
                              <input 
                              type="text" 
                              id="valeur" 
                              name="product_Name" 
                              value={editedProduct ? editedProduct.product_Name : ''} 
                              onChange={handleInputChange} 
                              className="columnUser"
                          />
                          
                            ) : (
                                <p id="valeur"> {product.product_Name}</p>
                            )}
                        </div>
                        <div className="columns">
                            <p id="titre">Product ID:</p>
                            {isEditing ? (
                                <input
                                    type="number"
                                    id="valeur"
                                    name="id"
                                    value={editedProduct ? editedProduct.id : ''}
                                    onChange={handleInputChange}
                                    className="columnUser"
                                />
                            ) : (
                                <p id="valeur"> {product.id}</p>
                            )}
                        </div>

                        <div className="columns">
                            <p id="titre">Product Category:</p>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    id="valeur" 
                                    name="Category" 
                                    value={editedProduct ? editedProduct.Category : ''} 
                                    onChange={handleInputChange} 
                                    className="columnUser"
                                />
                            ) : (
                                <p id="valeur"> {product.Category}</p>
                            )}
                        </div>
                        <div className="columns">
                            <p id="titre">Buying Price</p>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    id="valeur" 
                                    name="buying_price" 
                                    value={editedProduct ? editedProduct.buying_price : ''} 
                                    onChange={handleInputChange} 
                                    className="columnUser"
                                />
                            ) : (
                                <p id="valeur"> {product.buying_price}</p>
                            )}
                        </div>
                        <div className="columns">
                            <p id="titre">Threshold Value</p>
                            {isEditing ? (
                                <input 
                                    type="number" 
                                    id="valeur" 
                                    name="thershold" 
                                    value={editedProduct ? editedProduct.thershold : ''} 
                                    onChange={handleInputChange} 
                                    className="columnUser"
                                />
                            ) : (
                                <p id="valeur">{product.thershold}</p>
                            )}
                        </div>
                        <div className="columns">
                            <p id="titre">Expiry Date: </p>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    id="valeur" 
                                    name="expire" 
                                    value={editedProduct ? editedProduct.expire : ''} 
                                    onChange={handleInputChange} 
                                    className="columnUser"
                                />
                            ) : (
                                <p id="valeur">{product.expire}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        {product.image && <img src={product.image} alt="Product" className="produitimg" />}
                    </div>
                    
                </div>
                 {/* Affichage du nom et du contact du fournisseur */}
            {allSuppliers && (
                <div>
                    <p className="detail">Supplier Details</p>
                    <div className="warehouse">
                        <p id="titre">Supplier Name</p>
                        {isEditing ? (
                            <select
                                id="valeur"
                                name="supplier_id"
                                value={editedProduct ? editedProduct.supplier_id : ''}
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
                    <div className="warehouses">
                        <p id="titre">Contact</p>
                        <p id="valeur"> {supplier?.contact}</p>
                    </div>
                </div>
            )}
            {/* Affichage du nom de l'entrepôt */}
            {warehouse && (
                <div>
                    <p className="detail">Stock Location</p>

                    <div className="warehouse">
                   
                    <p id="valeur"> {warehouse.name}</p>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default ProductDetails;

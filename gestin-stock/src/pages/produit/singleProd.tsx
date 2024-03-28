import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/api";
import Modal from "../produit/modal";
import "./singleProd.css";
import edit from "../../Assets/edition.png"
import SearchInput from "../../searchBar";
interface Product {
    id: number;
    product_Name: string;
    Category: string;
    buying_price: number;
    thershold: number;
    expire: string;
    quantity: number;
    availibilty: string;
}

const ProductDetails: React.FC = () => {
    // State
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);

    // Effects
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
        document.addEventListener("mousedown", handleClickOutsideModal);
        return () => {
            document.removeEventListener("mousedown", handleClickOutsideModal);
        };
    }, []);

    // Handlers
    const handleUpdate = () => {
        setShowUpdateDialog(true);
        setUpdatedProduct(product);
    };

    const handleCloseDialog = () => {
        setShowUpdateDialog(false);
        setUpdatedProduct(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (updatedProduct) {
            setUpdatedProduct(prevState => ({
                ...prevState!,
                [name]: value
            }));
        }
    };

    const handleSubmitUpdate = async () => {
        if (!updatedProduct) return;

        try {
            await supabase
                .from('product')
                .update(updatedProduct)
                .eq('id', updatedProduct.id);

            setProduct(updatedProduct);
            console.log(updatedProduct)
        } catch (error) {
            console.error('Error updating product:', error);
        }

        setShowUpdateDialog(false);
        setUpdatedProduct(null);
    };

    const handleClickOutsideModal = (event: MouseEvent) => {
        const modalContent = document.querySelector(".popup");
        if (modalContent && !modalContent.contains(event.target as Node)) {
            setShowUpdateDialog(false);
            setUpdatedProduct(null);
        }
    };

    // Render
    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            
            <div className="titre">
             <p> {product.product_Name}</p>
             <p onClick={handleUpdate} className="edit"> <img src={edit} className="imgedit"/>Edit</p>
             </div>
             <div className="left">
             <p>Overview</p>
             </div>
             <p className="lign"></p>
             <div className="cadre"> 
             <p className="detail">Primary Details</p>
             <div className="columns">
             <p>Name:</p>
             <p> {product.product_Name}</p>
             </div>
             <div className="columns">
             <p>ID:</p>
            <p> {product.id}</p>
            </div>
            <div className="columns">
            <p>Category:</p>
            <p> {product.Category}</p>
            </div>
            <div className="columns">
            <p>Buying Price:</p>
            <p> {product.buying_price}</p>
            </div>
            <div className="columns">
            <p>Threshold: </p>
            <p>{product.thershold}</p>
            </div>
            <div className="columns">
            <p>Expiry Date: </p>
            <p>{product.expire}</p>
            
            </div>
            </div>
            
            <Modal open={showUpdateDialog} onClose={handleCloseDialog}  >
                <div className="popup">
                    <p>Update Product</p>
                    <form onSubmit={handleSubmitUpdate}>
                        <div className="form">
                        <div className="column">
                        <label>Name:</label>
                        <input type="text" name="product_Name" value={updatedProduct?.product_Name} onChange={handleChange} className="update"/>
                        </div>
                        <div className="column">
                        <label>Category:</label>
                        <input type="text" name="Category" value={updatedProduct?.Category} onChange={handleChange} className="update"/>
                        </div>
                        <div className="column">
                        <label>Buying Price:</label>
                        <input type="number" name="buying_price" value={updatedProduct?.buying_price} onChange={handleChange}  className="update"/>
                        </div>
                        <div className="column">
                        <label>Threshold:</label>
                        <input type="number" name="thershold" value={updatedProduct?.thershold} onChange={handleChange}className="update" />
                        </div>
                        <div className="column">
                        <label>Expiry Date:</label>
                        <input type="text" name="expire" value={updatedProduct?.expire} onChange={handleChange} className="update"/>
                        </div>
                        <div className='buttons'>
                        <button type="button" onClick={handleCloseDialog} className="cancel">Cancel</button>
                        <button type="submit" className='add'>Save</button>
                        </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default ProductDetails;

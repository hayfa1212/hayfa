import React, { useEffect, useState } from "react";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Ajoutproduit from '../../pages/produit/ajoutProduit'; // Import the Ajoutproduit component
import './consulterProduit.css';
import trach from '../../Assets/Trash.svg'
import Modal from "react-modal";

interface Product {
    id: number;
    product_Name: string;
    Category: string;
    buying_price: number;
    thershold:number;
    expire:string;
    quantity:number;
    availibilty:string;
}

const PAGE_SIZE = 6; // Nombre de produits par page

const Consulterprod: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false); // State to manage modal visibility
    const [displayProducts, setDisplayProducts] = useState<Product[]>([]); // State to store products to display
    const [currentPage, setCurrentPage] = useState(1); // State to track current page
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null); // State to store the ID of the product to delete

    // Function to fetch products
    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('product')
                .select();

            if (!error) {
                setProducts(data || []);
                setDisplayProducts(data || []);
            } else {
                toast.error('Error fetching products');
            }
        } catch (error) {
            console.error('Error fetching products:');
            toast.error('An error occurred while fetching products');
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        fetchData();
    }, []);

    // Handler for search input
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        filterProducts(value);
    };

    // Function to filter products based on search term
    const filterProducts = (searchTerm: string) => {
        const filtered = products.filter(product =>
            product.product_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayProducts(filtered);
    };

    // Open modal for adding a product
    const openAddProductModal = () => {
        setIsAddProductModalOpen(true);
    };

    // Close modal for adding a product
    const closeAddProductModal = () => {
        setIsAddProductModalOpen(false);
    };

    // Open modal for deleting a product
    const openDeleteConfirmationModal = (productId: number) => {
        setDeleteProductId(productId);
    };

    // Close modal for deleting a product
    const closeDeleteConfirmationModal = () => {
        setDeleteProductId(null);
    };

    // Delete product
    const deleteProduct = async () => {
        if (deleteProductId !== null) {
            try {
                const { error } = await supabase
                    .from('product')
                    .delete()
                    .eq('id', deleteProductId);
    
                if (!error) {
                    // Remove the deleted product from the state
                    setProducts(prevProducts => prevProducts.filter(product => product.id !== deleteProductId));
                    setDisplayProducts(prevProducts => prevProducts.filter(product => product.id !== deleteProductId));
                    toast.success('Product deleted successfully');
                } else {
                    toast.error('Error deleting product');
                }
            } catch (error) {
                console.error('Error deleting product:');
                toast.error('An error occurred while deleting product');
            }
    
            closeDeleteConfirmationModal();
        }
    };

    // Function to get products for the current page
    const getCurrentPageProducts = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return displayProducts.slice(startIndex, endIndex);
    };

    // Function to handle next page
    const nextPage = () => {
        if (currentPage < getTotalPages()) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Function to handle previous page
    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Function to get total number of pages
    const getTotalPages = () => {
        return Math.ceil(displayProducts.length / PAGE_SIZE);
    };

    return (
        <div className="home">
            <div>
                <SearchInput onSearch={handleSearch} />
                <div>
                    <div className="headProd">
                        <p className="titlehead">Products</p>
                        <div className="buttons">
                            <button onClick={openAddProductModal} className="btn" id="add"> Add product</button>
                            <button className="btn">Filters</button>
                            <button className="btn">Download all</button>
                        </div>
                    </div>
                    <div>
                        <div className="titleProd">
                            <p>Products</p>
                            <p>Buynig Price</p>
                            <p>Quantity</p>
                            <p>Thershold values</p>
                            <p>expiry data</p>
                            <p>Availability</p>
                        </div>
                        {getCurrentPageProducts().map(product => (
                            <div key={product.id}>
                                <div className="ligneProd">
                                    <p>{product.product_Name}</p>
                                    <p>{product.buying_price}</p>
                                    <p>{product.quantity}</p>
                                    <p>{product.thershold}</p>
                                    <p>{product.expire}</p>
                                    <p style={{ color: product.availibilty === 'in-stock' ? '#10A760' : 'red' }}>{product.availibilty}</p>
                                    <img src={trach} className="trach" onClick={() => openDeleteConfirmationModal(product.id)} />
                                </div>
                                <p className="ligne"></p>
                            </div>
                        ))}
                        <div className="pagination">
                            <button onClick={previousPage} disabled={currentPage === 1}>Previous</button>
                            <span>Page {currentPage} of {getTotalPages()}</span>
                            <button onClick={nextPage} disabled={currentPage === getTotalPages()}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal className="modal"
                isOpen={deleteProductId !== null}
                onRequestClose={closeDeleteConfirmationModal}
            >
                <h2>Confirm Deletion</h2>
               

                <p>Are you sure you want to delete this product?</p>
                <div className="desecion">
                <button onClick={closeDeleteConfirmationModal} className="canc">Cancel</button>
                <button onClick={deleteProduct} className="del">Delete</button>
                
                </div>
            </Modal>

            <Ajoutproduit isOpen={isAddProductModalOpen} onClose={closeAddProductModal} />

            <ToastContainer/>
        </div>
    )
}

export default Consulterprod;

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Ajoutproduit from '../../pages/produit/ajoutProduit';
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

const PAGE_SIZE = 8;

const Consulterprod: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/");
                toast.error('You should login');
            } else {
                const { data: userData, error: userError } = await supabase
                    .from("utilisateur")
                    .select("role")
                    .eq("email", user.email)
                    .single();
    
                if (userError) {
                    console.error("Error fetching user data:", userError);
                    toast.error("An error occurred while fetching user data");
                } else {
                    const userRole = userData?.role;
                  
    
                    if (userRole) {
                        console.log("User role:", userRole);
                    } else {
                        console.error("User role not found");
                        toast.error("User role not found");
                    }
                }
            }
        };
        checkLoggedIn();
    }, [navigate]);
    

    useEffect(() => {
        fetchData();
    }, []);

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

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        filterProducts(value);
    };

    const filterProducts = (searchTerm: string) => {
        const filtered = products.filter(product =>
            product.product_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayProducts(filtered);
    };

    const openAddProductModal = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userData, error: userError } = await supabase
                .from("utilisateur")
                .select("role")
                .eq("email", user.email)
                .single();

            if (userError) {
                console.error("Error fetching user data:", userError);
                toast.error("An error occurred while fetching user data");
            } else {
                const userRole = userData?.role;
                if (userRole === "responsable logistique") {
                    toast.error("You do not have permission to add products");
                } else {
                    setIsAddProductModalOpen(true);
                }
            }
        } else {
            navigate("/");
            toast.error('You should login');
        }
    };

    const closeAddProductModal = () => {
        setIsAddProductModalOpen(false);
    };

    const openDeleteConfirmationModal = async (productId: number) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userData, error: userError } = await supabase
                .from("utilisateur")
                .select("role")
                .eq("email", user.email)
                .single();

            if (userError) {
                console.error("Error fetching user data:", userError);
                toast.error("An error occurred while fetching user data");
            } else {
                const userRole = userData?.role;
                if (userRole === "responsable logistique") {
                    toast.error("You do not have permission to delete products");
                } else {
                    setDeleteProductId(productId);
                }
            }
        } else {
            navigate("/");
            toast.error('You should login');
        }
    };

    const closeDeleteConfirmationModal = () => {
        setDeleteProductId(null);
    };

    const deleteProduct = async () => {
        if (deleteProductId !== null) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: userData, error: userError } = await supabase
                    .from("utilisateur")
                    .select("role")
                    .eq("email", user.email)
                    .single();

                if (userError) {
                    console.error("Error fetching user data:", userError);
                    toast.error("An error occurred while fetching user data");
                } else {
                    const userRole = userData?.role;
                    if (userRole === "responsable logistique") {
                        toast.error("You do not have permission to delete products");
                    } else {
                        try {
                            const { error } = await supabase
                                .from('product')
                                .delete()
                                .eq('id', deleteProductId);

                            if (!error) {
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
                }
            } else {
                navigate("/");
                toast.error('You should login');
            }
        }
    };

    const getCurrentPageProducts = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return displayProducts.slice(startIndex, endIndex);
    };

    const nextPage = () => {
        if (currentPage < getTotalPages()) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getTotalPages = () => {
        return Math.ceil(displayProducts.length / PAGE_SIZE);
    };

    const getTotalProducts = () => {
        return products.length;
    };

    const getTotalCategories = () => {
        const uniqueCategories = Array.from(new Set(products.map(product => product.Category)));
        return uniqueCategories.length;
    };

    const countOutOfStockProducts = () => {
        return products.filter(product => product.availibilty === 'Out of stock').length;
    };

    const getTotalBuyingPrice = () => {
        return products.reduce((total, product) => total + product.buying_price, 0);
    };

    return (
        <div className="home">
            <div>
                <SearchInput onSearch={handleSearch} />
                <div className="summary">
                    <p id="inve">Overall Inventory</p>
                    <div className="summ">
                        <div>
                            <p id="categ"> Categories</p>
                            <p className="number">{getTotalCategories()}</p>
                            <p className="note">Last 7 days</p>
                        </div>
                        <p className="bar"></p>
                        <div>
                            <p  id="totl">Total Products</p>
                            <div className="totale">
                                <div>
                            <p className="number">{getTotalProducts()}</p>
                            <p className="note">Last 7 days</p>
                            </div>
                            <div>
                            <p className="number">{getTotalBuyingPrice()}</p>
                            <p className="note">Revenue</p>
                            </div>
                            <p></p>
                            </div>
                        </div>
                        <p className="bar"></p>
                        <div>
                            <p id="low">Low Stocks</p>
                            <p className="number">{countOutOfStockProducts()}</p>
                            <p className="note">Not in stock</p>
                        </div>
                    </div>
                </div>
                <div className="change">
                    <div className="headProd">
                        <p className="titlehead">Products</p>
                        <div className="buttons">
                            <button onClick={openAddProductModal} className="btn" id="add"> Add product</button>
                            <button className="btn">Filters</button>
                            <button className="btn">Download all</button>
                        </div>
                    </div>
                    <div>
                        <table className="productTable">
                            <thead>
                                <tr className="titleProd">
                                    <td>Products</td>
                                    <td>Buying Price</td>
                                    <td>Quantity</td>
                                    <td>Thershold values</td>
                                    <td>Expiry data</td>
                                    <td>Availability</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageProducts().map(product => (
                                    
                                    <tr key={product.id} className="ligneproduit">
                                       
                                        <td>
                                            <NavLink to={`/product/${product.id}`} className="ligneProd">
                                                {product.product_Name}
                                            </NavLink>
                                        </td>
                                        <td>{product.buying_price}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.thershold}</td>
                                        <td>{product.expire}</td>
                                        <td style={{ color: product.availibilty === 'in-stock' ? '#10A760' : 'red' }}>
                                            {product.availibilty}
                                        </td>
                                        <td>
                                            <img src={trach} className="trach" onClick={() => openDeleteConfirmationModal(product.id)} />
                                        </td>
                                      
                                    </tr>
                                    
                                ))}
                               
                            </tbody>
                          
                        </table>
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
                style={{
                    overlay: {
                      backgroundColor: 'rgba(255, 255, 255, 0.7)' 
                    },
                    content: {
                      backgroundColor: 'rgb(248, 245, 245)' 
                    }
                  }}
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

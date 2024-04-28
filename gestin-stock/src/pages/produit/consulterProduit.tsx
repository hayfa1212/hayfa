import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Ajoutproduit from '../../pages/produit/ajoutProduit';
import './consulterProduit.css';
import trach from '../../Assets/Trash.svg';
import Swal from "sweetalert2";
import ProductRating from "../../pages/reat";

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
    const [userRole, setUserRole] = useState<string | null>(null);
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
                    const role = userData?.role;
                    if (!role) {
                        console.error("User role not found");
                        toast.error("User role not found");
                    } else {
                        setUserRole(role);
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
            console.error('Error fetching products:', error);
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

    const openAddProductModal = () => {
        if (userRole !== "responsable logistique") {
            setIsAddProductModalOpen(true);
        } else {
            toast.error("Vous n'êtes pas autorisé à ajouter des produits.");
        }
    };

    const closeAddProductModal = () => {
        setIsAddProductModalOpen(false);
    };

    const openDeleteConfirmationModal = (productId: number) => {
        if (userRole !== "responsable logistique") {
            Swal.fire({
                title: "Confirm Deletion",
                text: "Are you sure you want to delete this product?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteProduct(productId);
                }
            });
        } else {
            toast.error("Vous n'êtes pas autorisé à supprimer des produits.");
        }
    };

    const deleteProduct = async (productId: number) => {
        try {
            const { error } = await supabase
                .from('product')
                .delete()
                .eq('id', productId);

            if (!error) {
                setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
                setDisplayProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
                toast.success('Product deleted successfully');
            } else {
                toast.error('Error deleting product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('An error occurred while deleting product');
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

    const downloadAllProducts = () => {
        // Generate CSV content
        const csvContent = "data:text/csv;charset=utf-8," + 
            products.map(product => [product.product_Name, product.buying_price, product.quantity, product.thershold, product.expire, product.availibilty].join(",")).join("\n");
        // Create link element
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "products.csv");
        document.body.appendChild(link);
        // Simulate click
        link.click();
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
                            <button className="btn" onClick={downloadAllProducts}>Download all</button>
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
                                    <td>Rate</td>
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
                                        <td><ProductRating productId={product.id} /></td>
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
            <Ajoutproduit isOpen={isAddProductModalOpen} onClose={closeAddProductModal} />
            <ToastContainer/>
        </div>
    )
}

export default Consulterprod;

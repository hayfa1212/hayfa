import React, { useEffect, useState } from "react";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import './consulterSupplier.css'
import '../produit/consulterProduit.css';
import trash from '../../Assets/Trash.svg'
import editIcon from '../../Assets/edition.png'

import Modal from "react-modal";
import AddSupplier from "../../pages/supplier/ajoutSupplier";
import { useNavigate } from "react-router-dom";

interface Supplier {
    id: number;
    name: string;
    product: string;
    contact: number;
    email: string;
    type: string;
    onTheWay: string;
}

const ConsulterFournisseur: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
    const [deleteSupplierId, setDeleteSupplierId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate("/");
                toast.error('You should login')
            }
        };
        checkLoggedIn();
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('supplier')
                    .select();

                if (!error) {
                    setSuppliers(data || []);
                } else {
                    toast.error('Error fetching suppliers');
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                toast.error('An error occurred while fetching suppliers');
            }
        };
        fetchData();
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        filterSuppliers(value);
    };

    const filterSuppliers = (searchTerm: string) => {
        const filtered = suppliers.filter(supplier =>
            supplier.name && supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuppliers(filtered);
    };

    const openAddSupplierModal = () => {
        setIsAddSupplierModalOpen(true);
    };

    const closeAddSupplierModal = () => {
        setIsAddSupplierModalOpen(false);
    };

    const openDeleteConfirmationModal = (supplierId: number) => {
        setDeleteSupplierId(supplierId);
    };

    const closeDeleteConfirmationModal = () => {
        setDeleteSupplierId(null);
    };

    const deleteSupplier = async () => {
        if (deleteSupplierId !== null) {
            try {
                const { error } = await supabase
                    .from('supplier')
                    .delete()
                    .eq('id', deleteSupplierId);

                if (!error) {
                    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== deleteSupplierId);
                    setSuppliers(updatedSuppliers);
                    toast.success('Supplier deleted successfully');
                } else {
                    toast.error('Error deleting supplier');
                }
            } catch (error) {
                console.error('Error deleting supplier:', error);
                toast.error('An error occurred while deleting supplier');
            }

            closeDeleteConfirmationModal();
        }
    };

    const goToPage = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const openEditSupplierModal = (supplier: Supplier) => {
        setEditSupplier(supplier);
    };

    const closeEditSupplierModal = () => {
        setEditSupplier(null);
    };

    const updateSupplier = async (updatedSupplier: Supplier) => {
        try {
            const { error } = await supabase
                .from('supplier')
                .update(updatedSupplier)
                .eq('id', updatedSupplier.id);

            if (!error) {
                const updatedSuppliers = suppliers.map(supplier =>
                    supplier.id === updatedSupplier.id ? updatedSupplier : supplier
                );
                setSuppliers(updatedSuppliers);
                toast.success('Supplier updated successfully');
            } else {
                toast.error('Error updating supplier');
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
            toast.error('An error occurred while updating supplier');
        }

        closeEditSupplierModal();
    };

    return (
        <div className="home">
            <div>
                <SearchInput onSearch={handleSearch} />
                <div className="change">
                    <div className="headProd">
                        <p className="titlehead">Suppliers</p>
                        <div className="buttons">
                            <button onClick={openAddSupplierModal} className="btn" id="add"> Add Supplier</button>
                            <button className="btn">Filters</button>
                            <button className="btn">Download all</button>
                        </div>
                    </div>
                    <div>
                        <div className="titleSup">
                            
                                <p id="sus">Supplier Name</p>
                                <p id="sus">Product</p>
                                <p id="sus">Contact Number</p>
                                <p id="sus">Email</p>
                                <p id="sus">Type</p>
                                <p id="sus">On the way</p>
                                <p id="sus">Action</p>
                          
                        </div>
                        {suppliers.map(supplier => (
                            <div key={supplier.id} className="supplier-container">
                                <div className="lignesuuolier">
                                    <p id="su">{supplier.name}</p>
                                    <p id="su">{supplier.product}</p>
                                    <p id="su">{supplier.contact}</p>
                                    <p id="su">{supplier.email}</p>
                                    <p id="su">{supplier.type}</p>
                                    <p id="su">{supplier.onTheWay}</p>
                                    <div id="su">
                                        <img src={editIcon} alt="Edit" className="trach" onClick={() => openEditSupplierModal(supplier)} />
                                        <img src={trash} alt="Delete" className="trach" onClick={() => openDeleteConfirmationModal(supplier.id)} />
                                    </div>
                                </div>
                                <p className="ligne"></p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pagination">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {Math.ceil(suppliers.length / itemsPerPage)}</span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === Math.ceil(suppliers.length / itemsPerPage)}>Next</button>
                </div>
            </div>

            <Modal
                className="modal"
                isOpen={deleteSupplierId !== null}
                onRequestClose={closeDeleteConfirmationModal}
                style={{
                    overlay: {
                      backgroundColor: 'rgba(255, 255, 255, 0.7)' // Couleur de fond du modal
                    },
                    content: {
                      backgroundColor: 'rgb(248, 245, 245)' // Couleur de fond du contenu du modal
                     
                    }
                  }}
            >
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this supplier?</p>
                <div className="decision">
                    <button onClick={closeDeleteConfirmationModal} className="canc">Cancel</button>
                    <button onClick={deleteSupplier} className="del">Delete</button>
                </div>
            </Modal>

            <Modal
                className="modal"
                style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, content: { backgroundColor: 'white', width: '25rem', height: '35rem', marginTop:"2rem" } }}
                isOpen={editSupplier !== null}
                onRequestClose={closeEditSupplierModal}
            >
                <p id="newUser">Edit Supplier</p>
                {editSupplier && (
                    <form  className="form" onSubmit={(e) => {
                        e.preventDefault();
                        updateSupplier(editSupplier);
                    }}> 
                    <div className="column">
                        <label>Name:</label>
                        <input
                        className="columnUser"
                            type="text"
                            value={editSupplier.name}
                            onChange={(e) => setEditSupplier(prevState => ({ ...prevState!, name: e.target.value }))}
                        />
                       </div>
                       <div className="column">
                        <label>Product:</label>
                        <input
                        className="columnUser"
                            type="text"
                            value={editSupplier.product}
                            onChange={(e) => setEditSupplier(prevState => ({ ...prevState!, product: e.target.value }))}
                        />
                        </div >
                        <div className="column">
                        <label>Contact:</label>
                        <input
                        className="columnUser"
                            type="number"
                            value={editSupplier.contact}
                            onChange={(e) => setEditSupplier(prevState => ({ ...prevState!, contact: parseInt(e.target.value, 10) }))}
                        />
                        </div>
                        <div className="column">
                        <label>Email:</label>
                        <input
                        className="columnUser"
                            type="email"
                            value={editSupplier.email}
                            onChange={(e) => setEditSupplier(prevState => ({ ...prevState!, email: e.target.value }))}
                        />
                        </div>
                        <div className="column">
                        <label>Type:</label>
                        <select
                        className="columnUser"
                            value={editSupplier.type}
                            onChange={(e) => setEditSupplier(prevState => ({ ...prevState!, type: e.target.value }))}
                        >
                            <option value="">Select Type</option>
                            <option value="Take Return">Take Return</option>
                            <option value="Not Take Return">Not Take Return</option>
                        </select>
                        </div>
                        <div className="column">
                        <label>On the Way:</label>
                        <input
                        className="columnUser"
                            type="text"
                            value={editSupplier.onTheWay}
                            onChange={(e) => setEditSupplier(prevState => ({ ...prevState!, onTheWay: e.target.value }))}
                        />
                        </div>
                        <div className='buttons'>
                            <button onClick={closeEditSupplierModal} className="canc">Cancel</button>
                            <button type="submit" className="del" style={{ backgroundColor: 'blue', color: 'white' }}>Update</button>
                        </div>
                    </form>
                )}
            </Modal>

            <AddSupplier isOpen={isAddSupplierModalOpen} onClose={closeAddSupplierModal} />

            <ToastContainer />
        </div>
    )
}

export default ConsulterFournisseur;

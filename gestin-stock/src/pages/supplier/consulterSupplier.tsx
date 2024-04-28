import React, { useEffect, useState } from "react";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import './consulterSupplier.css'
import '../produit/consulterProduit.css';
import trash from '../../Assets/Trash.svg'
import editIcon from '../../Assets/edition.png'
import Swal from 'sweetalert2';

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
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
            }finally {
                setLoading(false);
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

    const deleteSupplier = async (id: number) => {
        if (id !== null) {
            try {
                const { error } = await supabase
                    .from('supplier')
                    .delete()
                    .eq('id', id);

                if (!error) {
                    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
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

   

    const openEditModal = (supplier: Supplier) => {
        setEditSupplier(supplier);
        setIsEditModalOpen(true);
    };
    
    // Function to close the edit modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };
    
    // Function to update the supplier
    const updateSupplier = async (updatedSupplier: Supplier) => {
        try {
            const { data, error } = await supabase
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
    
        closeEditModal();
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
                      
                        <div>
                   <table className="supplier-table">
                   <thead>
                    <tr className="titleProd">
                      <th>Name</th>
                      <th>Product</th>
                      <th>Contact Number</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>On the Way</th>
                      <th>Action</th>
                    </tr>
                    </thead>
               <tbody>
                 {suppliers.map(supplier => (
                     <tr key={supplier.id}>
                       <td>{supplier.name}</td>
                        <td>{supplier.product}</td>
                        <td>{supplier.contact}</td>
                        <td>{supplier.email}</td>
                        <td>{supplier.type}</td>
                       <td>{supplier.onTheWay}</td>
                      <td>
                      <img src={editIcon} alt="Edit" className="trach" onClick={() => openEditModal(supplier)} />
                        <img src={trash} alt="Delete" className="trach" onClick={() => {
                            Swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!"
                              }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteSupplier(supplier.id);
                                }
                            });
                        }} />
                      </td>
                  </tr>
                ))}
             </tbody>
           </table>
         </div>
         <div className="pagination">
                    <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {currentPage} of {Math.ceil(suppliers.length / itemsPerPage)}</span>
                    <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === Math.ceil(suppliers.length / itemsPerPage)}>Next</button>
                </div>
                    </div>
                </div>
                
            </div>
            {editSupplier && (
    <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
       
        
        style={{
            content: {
                height: '25rem',
                width:"25rem", // Adjust height as needed
                backgroundColor: '#fff',
                marginLeft:"30rem"
              
             // Change background color as needed
            }
        }}
    >
        <div className="space">
        <p className="head" id="newUser">Edit Supplier</p>
        <div  className="User">
            <label>Name:</label>
            <input
            className="columnUser"
                type="text"
                value={editSupplier.name}
                onChange={e =>
                    setEditSupplier({ ...editSupplier, name: e.target.value })
                }
            />
        </div>
        <div  className="User">
            <label>Product:</label>
            <input
            className="columnUser"
                type="text"
                value={editSupplier.product}
                onChange={e =>
                    setEditSupplier({ ...editSupplier, product: e.target.value })
                }
            />
        </div>
        <div  className="User">
            <label>Contact Number:</label>
            <input
            className="columnUser"
                type="text"
                value={editSupplier.contact}
                onChange={e =>
                    setEditSupplier({ ...editSupplier })
                }
            />
        </div>
        <div  className="User">
            <label>Email:</label>
            <input
            className="columnUser"
                type="email"
                value={editSupplier.email}
                onChange={e =>
                    setEditSupplier({ ...editSupplier, email: e.target.value })
                }
            />
        </div>
        <div  className="User">
            <label>Type:</label>
            <input
            className="columnUser"
                type="text"
                value={editSupplier.type}
                onChange={e =>
                    setEditSupplier({ ...editSupplier, type: e.target.value })
                }
            />
        </div>
        <div  className="User">
            <label>On the Way:</label>
            <input
            className="columnUser"
                type="text"
                value={editSupplier.onTheWay}
                onChange={e =>
                    setEditSupplier({ ...editSupplier, onTheWay: e.target.value })
                }
            />
        </div>
        <div className='buttons'>
        <button onClick={closeEditModal} className="cancel">Cancel</button>
        <button onClick={() => updateSupplier(editSupplier)} className='add'>Update</button>
        </div>
        </div>
    </Modal>
)}


            <AddSupplier isOpen={isAddSupplierModalOpen} onClose={closeAddSupplierModal} />

            <ToastContainer />
        </div>
    )
}

export default ConsulterFournisseur;

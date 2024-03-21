import React, { useEffect, useState } from "react";
import SearchInput from "../../searchBar";
import Sidebar from "../../sideBar/sidebar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import './consulterSupplier.css'
import '../produit/consulterProduit.css';
import trach from '../../Assets/Trash.svg'

import Modal from "react-modal";
import Addsupplier from "../../pages/supplier/ajoutSupplier";

interface Supplier {
    id: number;
    name: string;
    product: string;
    contact: number;
    email: string;
}

const ConsulterFournisseur: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddSupplierModalOpen, setIsAddSupplierModalOpen] = useState(false);
    const [deleteSupplierId, setDeleteSupplierId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const indexOfLastSupplier = currentPage * itemsPerPage;
    const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
    const currentSuppliers = suppliers.slice(indexOfFirstSupplier, indexOfLastSupplier);

    const totalPages = Math.ceil(suppliers.length / itemsPerPage);

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

    useEffect(() => {
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

    return (
        <div className="home">
            <div>
                <SearchInput onSearch={handleSearch} />
                <div>
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
                            <p>Supplier</p>
                            <p>Product</p>
                            <p>Contact</p>
                            <p>Email</p>
                        </div>
                        {currentSuppliers.map(supplier => (
                            <div key={supplier.id}>
                                <div className="ligneProd">
                                    <p> {supplier.name}</p>
                                    <p>{supplier.product}</p>
                                    <p>{supplier.contact}</p>
                                    <p>{supplier.email}</p>
                                    <img src={trach} className="trach" onClick={() => openDeleteConfirmationModal(supplier.id)} />
                                </div>
                                <p className="ligne"></p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
            </div>

            <Modal className="modal"
                isOpen={deleteSupplierId !== null}
                onRequestClose={closeDeleteConfirmationModal}
            >
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this supplier?</p>
                <div className="decision">
                    <button onClick={closeDeleteConfirmationModal} className="canc">Cancel</button>
                    <button onClick={deleteSupplier} className="del">Delete</button>
                </div>
            </Modal>

            <Addsupplier isOpen={isAddSupplierModalOpen} onClose={closeAddSupplierModal} />

           

            <ToastContainer />
        </div>
    )
}

export default ConsulterFournisseur;

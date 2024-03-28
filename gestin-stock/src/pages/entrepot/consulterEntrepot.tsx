import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import trach from '../../Assets/Trash.svg'
import Modal from "react-modal";
import { Formik, Form, Field } from "formik";
import './consulterStore.css'
import Addstore from "./ajoutEntrepot";

interface Entrepot {
    id: number;
    name: string;
    location: string;
    Number: number;
    description: string;
}

const PAGE_SIZE = 3;

const Consultentrepot: React.FC = () => {
    const [entrepots, setEntrepots] = useState<Entrepot[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddEntrepotModalOpen, setIsAddEntrepotModalOpen] = useState(false);
    const [displayEntrepots, setDisplayEntrepots] = useState<Entrepot[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteEntrepotId, setDeleteEntrepotId] = useState<number | null>(null);
    const navigate = useNavigate();


    useEffect(() => {
        const checkLoggedIn = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                navigate("/");
                toast.error('You should login');
            }
        };

        checkLoggedIn();
    }, [navigate]);


    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('entrepot')
                .select();

            if (!error) {
                setEntrepots(data || []);
                setDisplayEntrepots(data || []);
            } else {
                toast.error('Error fetching entrepots');
            }
        } catch (error) {
            console.error('Error fetching entrepots:', error);
            toast.error('An error occurred while fetching entrepots');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        filterEntrepots(value);
    };

    const filterEntrepots = (searchTerm: string) => {
        const filtered = entrepots.filter(entrepot =>
            entrepot.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDisplayEntrepots(filtered);
    };

    const openAddEntrepotModal = () => {
        setIsAddEntrepotModalOpen(true);
    };

    const closeAddEntrepotModal = () => {
        setIsAddEntrepotModalOpen(false);
    };

    const getCurrentPageEntrepots = () => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return displayEntrepots.slice(startIndex, endIndex);
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
        return Math.ceil(displayEntrepots.length / PAGE_SIZE);
    };

    const openDeleteConfirmationModal = (entrepotId: number) => {
        setDeleteEntrepotId(entrepotId);
    };

    const closeDeleteConfirmationModal = () => {
        setDeleteEntrepotId(null);
    };

    const deleteEntrepot = async () => {
        if (deleteEntrepotId !== null) {
            try {
                const { error } = await supabase
                    .from('entrepot')
                    .delete()
                    .eq('id', deleteEntrepotId);

                if (!error) {
                    setEntrepots(prevEntrepots => prevEntrepots.filter(entrepot => entrepot.id !== deleteEntrepotId));
                    setDisplayEntrepots(prevEntrepots => prevEntrepots.filter(entrepot => entrepot.id !== deleteEntrepotId));
                    toast.success('Entrepot deleted successfully');
                } else {
                    toast.error('Error deleting entrepot');
                }
            } catch (error) {
                console.error('Error deleting entrepot:', error);
                toast.error('An error occurred while deleting entrepot');
            }

            closeDeleteConfirmationModal();
        }
    };

    return (
        <div className="home">
            <div>
                <SearchInput onSearch={handleSearch} />
                <div>
                    <div className="headProd">
                        <p className="titlehead">Entrepots</p>
                        <div className="buttons">
                            <button onClick={openAddEntrepotModal} className="btn" id="add"> Add entrepot</button>
                           
                        </div>
                    </div>
                    <div>
                        <p className="ligne"></p>
                        
                        {getCurrentPageEntrepots().map(entrepot => (
                            <div key={entrepot.id} >
                                <div className="store">
                                <div  className="storform">
                                        <p>{entrepot.name}</p>
                                        <p>{entrepot.location}</p>
                                        <p>{entrepot.Number}</p>
                                        <p>{entrepot.description}</p>
                                </div>
                                <div>
                                    
                                <img src={trach} className="trach" onClick={() => openDeleteConfirmationModal(entrepot.id)} />
                                <button className="Edit">Edit</button>
                               </div>
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
                isOpen={deleteEntrepotId !== null}
                onRequestClose={closeDeleteConfirmationModal}
            >
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this entrepot?</p>
                <div className="desecion">
                    <button onClick={closeDeleteConfirmationModal} className="canc">Cancel</button>
                    <button onClick={deleteEntrepot} className="del">Delete</button>
                </div>
            </Modal>

            <Addstore isOpen={isAddEntrepotModalOpen} onClose={closeAddEntrepotModal} />

            <ToastContainer/>
        </div>
    )
}
export default  Consultentrepot;
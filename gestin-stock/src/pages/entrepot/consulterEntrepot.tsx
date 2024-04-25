import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import trash from '../../Assets/Trash.svg';
import Modal from "react-modal";
import { Formik, Form, Field } from "formik";
import './consulterStore.css';
import Addstore from "./ajoutEntrepot";
import Swal from 'sweetalert2';

interface Entrepot {
    id: number;
    name: string;
    location: string;
    Number: number;
    description: string;
    image: string;
}

const PAGE_SIZE = 3;

const Consultentrepot: React.FC = () => {
    const [entrepots, setEntrepots] = useState<Entrepot[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddEntrepotModalOpen, setIsAddEntrepotModalOpen] = useState(false);
    const [displayEntrepots, setDisplayEntrepots] = useState<Entrepot[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editEntrepotId, setEditEntrepotId] = useState<number | null>(null);
    const [editedEntrepot, setEditedEntrepot] = useState<Entrepot | null>(null);
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
        Swal.fire({
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete this entrepot?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEntrepot(entrepotId);
            }
        });
    };

    const deleteEntrepot = async (entrepotId: number) => {
        try {
            const { error } = await supabase
                .from('entrepot')
                .delete()
                .eq('id', entrepotId);

            if (!error) {
                setEntrepots(prevEntrepots => prevEntrepots.filter(entrepot => entrepot.id !== entrepotId));
                setDisplayEntrepots(prevEntrepots => prevEntrepots.filter(entrepot => entrepot.id !== entrepotId));
                toast.success('Entrepot deleted successfully');
            } else {
                toast.error('Error deleting entrepot');
            }
        } catch (error) {
            console.error('Error deleting entrepot:', error);
            toast.error('An error occurred while deleting entrepot');
        }
    };

    const openEditModal = (entrepotId: number) => {
        setEditEntrepotId(entrepotId);
        const selectedEntrepot = entrepots.find(entrepot => entrepot.id === entrepotId);
        setEditedEntrepot(selectedEntrepot || null);
    };

    const closeEditModal = () => {
        setEditEntrepotId(null);
        setEditedEntrepot(null);
    };

    const handleEditSubmit = async (editedValues: Entrepot) => {
        try {
            const { error } = await supabase
                .from('entrepot')
                .update({
                    name: editedValues.name,
                    location: editedValues.location,
                    Number: editedValues.Number,
                    description: editedValues.description,
                })
                .eq('id', editedValues.id);

            if (!error) {
                toast.success('Entrepot updated successfully');
                closeEditModal();
                fetchData(); // Refresh data after update
            } else {
                toast.error('Error updating entrepot');
            }
        } catch (error) {
            console.error('Error updating entrepot:', error);
            toast.error('An error occurred while updating entrepot');
        }
    };

    return (
        <div className="home">
            <div>
                <SearchInput onSearch={handleSearch} />
                <div className="change">
                    <div className="headstore">
                        <p className="titlehead">Entrepots</p>
                        <div className="buttons">
                            <button onClick={openAddEntrepotModal} className="btn" id="add"> Add entrepot</button>
                           
                        </div>
                    </div>
                    <div>
                        {getCurrentPageEntrepots().map(entrepot => (
                            <div key={entrepot.id}  > 
                                <div  className="storform">
                                  {entrepot.image ? (
                                  <img src={entrepot.image} alt={entrepot.name} className="imgstore" />
                                         ) : (
                                    <div className="rectangle"></div>
                                          )}
                                       <div  className="formstore">
                                       <div>
                                        <p id="storename">{entrepot.name}</p>
                                        <p id="info">{entrepot.location}</p>
                                        <p id="info">{entrepot.Number}</p>
                                        <p id="info">{entrepot.description}</p> 
                                       </div>
                                       <div className="decison">
                                      <button className="btn" id="editstore"    onClick={() => openEditModal(entrepot.id)}>Edit</button> 
                                      <img src={trash} className="trachs"    onClick={() => openDeleteConfirmationModal(entrepot.id)} />    
                                </div>
                              </div>
                               </div>
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

            <Addstore isOpen={isAddEntrepotModalOpen} onClose={closeAddEntrepotModal} />

            <ToastContainer/>
        </div>
    )
}

export default Consultentrepot;

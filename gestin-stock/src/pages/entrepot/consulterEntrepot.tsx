import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import supabase from "../../utils/api";
import Swal from 'sweetalert2';
import Modal from "react-modal";
import Addstore from "./ajoutEntrepot";
import SearchInput from "../../searchBar";
import trash from '../../Assets/poubelle.png';
import './consulterStore.css'; // Importation de votre fichier CSS

interface Entrepot {
    id: number;
    name: string;
    location: string;
    Number: number;
    description: string;
    capacite: number;
    image: string;
}

const PAGE_SIZE = 3;

const Consultentrepot: React.FC = () => {
    const [entrepots, setEntrepots] = useState<Entrepot[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddEntrepotModalOpen, setIsAddEntrepotModalOpen] = useState(false);
    const [displayEntrepots, setDisplayEntrepots] = useState<Entrepot[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editingEntrepot, setEditingEntrepot] = useState<Entrepot | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newImage, setNewImage] = useState<File | null>(null);

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

    const openEditModal = (entrepot: Entrepot) => {
        setEditingEntrepot(entrepot);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditingEntrepot(null);
        setIsEditModalOpen(false);
    };

    const updateEntrepot = async (updatedEntrepot: Entrepot) => {
        try {
            // Update entrepot without image
            const { data: entrepotData, error: entrepotError } = await supabase
                .from('entrepot')
                .update(updatedEntrepot)
                .eq('id', updatedEntrepot.id);

            if (entrepotError) {
                console.error('Error updating entrepot:', entrepotError.message);
                toast.error('An error occurred while updating entrepot');
            } else {
                console.log('Entrepot updated successfully without image');

                // If a new image is selected, update the image
                if (newImage) {
                    const { data: fileData, error: fileError } = await supabase.storage
                        .from('imagestore')
                        .upload(`${newImage.name}`, newImage);

                    if (fileError) {
                        console.error('Error uploading image to Supabase Storage:', fileError.message);
                        toast.error('An error occurred while uploading image');
                    } else {
                        const response = await supabase.storage
                            .from("imagestore")
                            .getPublicUrl(`${newImage.name}`);
                        const imageUrl = response.data.publicUrl;

                        const { data: updatedEntrepotData, error: updatedEntrepotError } = await supabase
                            .from('entrepot')
                            .update({ ...updatedEntrepot, image: imageUrl })
                            .eq('id', updatedEntrepot.id);

                        if (updatedEntrepotError) {
                            console.error('Error updating entrepot with image:', updatedEntrepotError.message);
                            toast.error('An error occurred while updating entrepot with image');
                        } else {
                            console.log('Entrepot updated successfully with image');
                            closeEditModal();
                            toast.success('Entrepot updated successfully');
                        }
                    }
                } else {
                    // If no new image selected, close modal and show success message
                    closeEditModal();
                    toast.success('Entrepot updated successfully');
                }
            }
        } catch (error) {
            console.error('Error updating entrepot:', error);
            toast.error('An error occurred while updating entrepot');
        }
    };

    return (
        <div className="home" style={{ display: "flex", flexDirection: "column" }}>
            <SearchInput onSearch={handleSearch} />
            <div></div>
            <div className="change">
                <div className="headstore">
                    <p className="titlehead">Entrepots</p>
                    <div className="buttons">
                        <button onClick={() => setIsAddEntrepotModalOpen(true)} className="btn" id="add"> Add entrepot</button>
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
                                        <p id="info">{entrepot.capacite}</p>
                                      
                                    </div>
                                    <div>  <p id="info">{entrepot.description}</p> </div>
                                    <div className="decison">
                                        <button onClick={() => openEditModal(entrepot)}className="trachs"  id="editstore">Edit</button> 
                                        <img src={trash} className="trachs" onClick={() => openDeleteConfirmationModal(entrepot.id)} />    
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
            <Addstore isOpen={isAddEntrepotModalOpen} onClose={() => setIsAddEntrepotModalOpen(false)} />
            <ToastContainer/>
            {editingEntrepot && (
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeEditModal}
                    style={{
                        content: {
                            height: '25rem',
                            width: '25rem',
                            backgroundColor: '#fff',
                            marginLeft: '30rem'
                        }
                    }}
                >
                    <div className="space">
                        <p className="head" id="newUser">Edit Entrepot</p>
                        <div className="User">
                            <label>Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setNewImage(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        <div className="User">
                            <label>Name:</label>
                            <input
                                className="columnUser"
                                type="text"
                                value={editingEntrepot.name}
                                onChange={e =>
                                    setEditingEntrepot({ ...editingEntrepot, name: e.target.value })
                                }
                            />
                        </div>
                        <div className="User">
                            <label>Location:</label>
                            <input
                                className="columnUser"
                                type="text"
                                value={editingEntrepot.location}
                                onChange={e =>
                                    setEditingEntrepot({ ...editingEntrepot, location: e.target.value })
                                }
                            />
                        </div>
                        <div className="User">
                            <label>Number:</label>
                            <input
                                className="columnUser"
                                type="text"
                                value={editingEntrepot.Number}
                                onChange={e =>
                                    setEditingEntrepot({ ...editingEntrepot, Number: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>
                        <div className="User">
                            <label>Capacity:</label>
                            <input
                                className="columnUser"
                                type="text"
                                value={editingEntrepot.capacite}
                                onChange={e =>
                                    setEditingEntrepot({ ...editingEntrepot, capacite: parseInt(e.target.value) || 0 })
                                }
                            />
                        </div>
                        <div className="User">
                            <label>Description:</label>
                            <input
                                className="columnUser"
                                type="text"
                                value={editingEntrepot.description}
                                onChange={e =>
                                    setEditingEntrepot({ ...editingEntrepot, description: e.target.value })
                                }
                            />
                        </div>
                     
                        <div className="buttons">
                            <button onClick={closeEditModal} className="cancel">Cancel</button>
                            <button onClick={() => updateEntrepot(editingEntrepot)} className='add'>Update</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default Consultentrepot;

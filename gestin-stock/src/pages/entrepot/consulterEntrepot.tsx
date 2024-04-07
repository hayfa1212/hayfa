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
    image: string;
}

const PAGE_SIZE = 3;

const Consultentrepot: React.FC = () => {
    const [entrepots, setEntrepots] = useState<Entrepot[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddEntrepotModalOpen, setIsAddEntrepotModalOpen] = useState(false);
    const [displayEntrepots, setDisplayEntrepots] = useState<Entrepot[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteEntrepotId, setDeleteEntrepotId] = useState<number | null>(null);
    const [editEntrepotId, setEditEntrepotId] = useState<number | null>(null); // Nouvel état pour l'ID de l'entrepôt en cours d'édition
    const [editedEntrepot, setEditedEntrepot] = useState<Entrepot | null>(null); // Nouvel état pour stocker les informations de l'entrepôt en cours d'édition
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
                fetchData(); // Actualiser les données après la mise à jour
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
                                      <img src={trach} className="trachs"    onClick={() => openDeleteConfirmationModal(entrepot.id)} />    
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
            <Modal className="modal"
                isOpen={deleteEntrepotId !== null}
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
                <p>Are you sure you want to delete this entrepot?</p>
                <div className="desecion">
                    <button onClick={closeDeleteConfirmationModal} className="canc">Cancel</button>
                    <button onClick={deleteEntrepot} className="del">Delete</button>
                </div>
            </Modal>

            <Modal className="modale"
              isOpen={editEntrepotId !== null}
              onRequestClose={closeEditModal}
              >
              <p id="newUser">Edit Entrepot</p>
              {editedEntrepot && (
                 <Formik
                    initialValues={editedEntrepot}
                    onSubmit={handleEditSubmit}
                     >
                 {({ errors, touched }) => (
                    <Form id="form">
                        <div className="columns">
                        <p>Name</p>
                      <Field type="text" name="name"   className="columnUser"/>
                      {errors.name && touched.name && <div>{errors.name}</div>}
                      </div>
                      <div className="columns"><p>Location</p>
                      <Field type="text" name="location"   className="columnUser"/>
                      {errors.location && touched.location && <div>{errors.location}</div>}
                      </div>
                      <div className="columns"><p>Number</p>
                      <Field type="number" name="Number"   className="columnUser"/>
                      {errors.Number && touched.Number && <div>{errors.Number}</div>}
                      </div>
                      <div className="columns"><p>Descreption</p>
                      <Field type="text" name="description"  className="descrep" />
                      {errors.description && touched.description && <div>{errors.description}</div>}
                      </div>
                      <div className="buttons">
                        <button type="submit" className="add">Save</button>
                        <button type="button" className="cancel" onClick={closeEditModal}>Cancel</button>
                      </div>
                  </Form>
              )}
           </Formik>
    )}
</Modal>


            <Addstore isOpen={isAddEntrepotModalOpen} onClose={closeAddEntrepotModal} />

            <ToastContainer/>
        </div>
    )
}

export default  Consultentrepot;

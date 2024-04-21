import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import AjoutCommande from "../order/creeorder";
import Modal from "react-modal";
import "./suivieorder.css";
import trash from '../../Assets/Trash.svg';

interface Commande {
    id: number;
    product: string;
    category: string;
    orderValue: number;
    quantity: number;
    unit: string;
    buyingPrice: number;
    dateDelivery: string;
    status: string;
}

const PAGE_SIZE = 10;

const ConsulterCommande: React.FC = () => {
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
    const [deleteCommandId, setDeleteCommandId] = useState<number | null>(null);
    const [editedCommandeId, setEditedCommandeId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('commande')
                .select();

            if (!error) {
                setCommandes(data || []);
            } else {
                toast.error('Erreur lors de la récupération des commandes');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes :', error);
            toast.error('Une erreur est survenue lors de la récupération des commandes');
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const filterCommandes = (commandes: Commande[], searchTerm: string) => {
        return commandes.filter(commande =>
            commande.product.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getCurrentPageCommandes = () => {
        const filteredCommandes = filterCommandes(commandes, searchTerm);
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return filteredCommandes.slice(startIndex, endIndex);
    };

    const openAddOrderModal = () => {
        setIsAddOrderModalOpen(true);
    };

    const closeAddOrderModal = () => {
        setIsAddOrderModalOpen(false);
    };

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            await supabase
                .from('commande')
                .update({ status: newStatus })
                .eq('id', id);

            toast.success('Statut mis à jour avec succès');
            fetchData();
            setEditedCommandeId(null);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut :', error);
            toast.error('Une erreur est survenue lors de la mise à jour du statut');
        }
    };

    const openDeleteConfirmationModal = (id: number) => {
        setDeleteCommandId(id);
    };

    const closeDeleteConfirmationModal = () => {
        setDeleteCommandId(null);
    };

    const deleteCommande = async () => {
        if (deleteCommandId !== null) {
            try {
                await supabase
                    .from('commande')
                    .delete()
                    .eq('id', deleteCommandId);

                toast.success('Commande supprimée avec succès');
                fetchData();
            } catch (error) {
                console.error('Erreur lors de la suppression de la commande :', error);
                toast.error('Une erreur est survenue lors de la suppression de la commande');
            }
            closeDeleteConfirmationModal();
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        const totalPages = Math.ceil(filterCommandes(commandes, searchTerm).length / PAGE_SIZE);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const getTotalPages = () => {
        return Math.ceil(filterCommandes(commandes, searchTerm).length / PAGE_SIZE);
    };

    const enableEditStatus = (id: number) => {
        setEditedCommandeId(id);
    };

    const disableEditStatus = () => {
        setEditedCommandeId(null);
    };

    return (
        <div className="home">
            <div>
                <SearchInput onSearch={handleSearch} />
                <div className="change">
                    <div className="headProd">
                        <p className="titlehead">Orders</p>
                        <div className="buttons">
                            <button onClick={openAddOrderModal} className="btn" id="add"> Add order</button>
                            <button className="btn">Filters</button>
                            <button className="btn">Download all</button>
                        </div>
                    </div>
                    <div>
                        <table className="commandes-table">
                            <thead>
                                <tr className="titleCommandes">
                                    <th>Product</th>
                                    <th>Order Value</th>
                                    <th>Quantity</th>
                                    <th>Order ID</th>
                                    <th>Date Delivery</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageCommandes().map((commande, index) => (
                                    <React.Fragment key={commande.id}>
                                        <tr>
                                            <td>
                                                <NavLink to={`/orders/${commande.id}`} className="ligneProd">
                                                    {commande.product}
                                                </NavLink>
                                            </td>
                                            <td>{commande.orderValue}</td>
                                            <td>{commande.quantity}</td>
                                            <td>{commande.id}</td>
                                            <td>{commande.dateDelivery}</td>
                                            <td>
                                                {editedCommandeId === commande.id ? (
                                                    <select
                                                        value={commande.status}
                                                        onChange={(e) => updateStatus(commande.id, e.target.value)}
                                                        onBlur={disableEditStatus}
                                                        className="status"
                                                    >
                                                        <option value="Delayed" style={{ color: '#FFA500' }}>Delayed</option>
                                                        <option value="Returned">Returned</option>
                                                        <option value="Confirmed" style={{ color: '#008000' }}>Confirmed</option>
                                                    </select>
                                                ) : (
                                                    <button onClick={() => enableEditStatus(commande.id)} className="status-button"   style={{ color: commande.status === 'Confirmed' ? '#1366D9' : (commande.status === 'Delayed' ? '#F79009' : '') }}>
                                                        {commande.status}
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                <img src={trash} className="trash-icon" onClick={() => openDeleteConfirmationModal(commande.id)} alt="Delete" />
                                            </td>
                                        </tr>
                                        {index !== getCurrentPageCommandes().length - 1 && (
                                            <tr className="separator-row"></tr>
                                        )}
                                    </React.Fragment>
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
            <Modal
             isOpen={deleteCommandId !== null}
             onRequestClose={closeDeleteConfirmationModal}
             style={{
             overlay: {
              backgroundColor: 'rgba(255, 255, 255, 0.7)'
            },
            content: {
              backgroundColor: 'rgb(248, 245, 245)',
              width: '20rem', // Définir la largeur de la fenêtre modale à 50% de la taille de l'écran
              height: '12rem', // Hauteur automatique pour s'adapter au contenu
              margin: 'auto', // Centrer horizontalement
              top: '25%' // Centrer verticalement à 25% du haut de la fenêtre
              }
            }}
          >
          <h2>Confirm Deletion</h2>
       <p>Are you sure you want to delete this command?</p>
       <div className="desecion">
          <button onClick={closeDeleteConfirmationModal} className="canc">Cancel</button>
          <button onClick={deleteCommande} className="del">Delete</button>
       </div>
      </Modal>

            <AjoutCommande isOpen={isAddOrderModalOpen} onClose={closeAddOrderModal} />
            <ToastContainer/>
        </div>
    );
}

export default ConsulterCommande;

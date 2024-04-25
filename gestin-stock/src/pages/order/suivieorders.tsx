import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SearchInput from "../../searchBar";
import supabase from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import AjoutCommande from "../order/creeorder";
import './suivieorder.css';
import trash from '../../Assets/Trash.svg';
import Swal from 'sweetalert2';

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
        Swal.fire({
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete this command?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCommande(id);
            }
        });
    };

    const deleteCommande = async (id: number) => {
        if (id !== null) {
            try {
                await supabase
                    .from('commande')
                    .delete()
                    .eq('id', id);

                toast.success('Commande supprimée avec succès');
                fetchData();
            } catch (error) {
                console.error('Erreur lors de la suppression de la commande :', error);
                toast.error('Une erreur est survenue lors de la suppression de la commande');
            }
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
            <AjoutCommande isOpen={isAddOrderModalOpen} onClose={closeAddOrderModal} />
            <ToastContainer/>
        </div>
    );
}

export default ConsulterCommande;

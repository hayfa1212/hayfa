import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import box from '../Assets/box.png';
import './sideBar.css';
import dashbord from '../Assets/Home.png';
import inventory from '../Assets/Inventory.png';
import report from '../Assets/Report.png';
import order from '../Assets/Order.png';
import supplier from '../Assets/Suppliers.png';
import store from '../Assets/Manage Store.png';
import setting from '../Assets/Settings.png';
import logOut from '../Assets/Log Out.png';
import supabase from '../utils/api';
import user from "../Assets/Suppliers.png";

interface SidebarProps {
    children?: ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
    const handleLogout = async () => {
        try {
            // Obtenez l'utilisateur actuellement connecté
            const { data: { user }  } = await supabase.auth.getUser()

            if (user) {
                // Mettez à jour la colonne 'connecté' de l'utilisateur dans la table utilisateur
                const { error } = await supabase
                    .from("utilisateur")
                    .update({connecter: false })
                    .eq("email", user.email);

                if (error) {
                    console.error("Erreur lors de la mise à jour de l'état de connexion :", error.message);
                    // Gérer les erreurs de mise à jour de l'état de connexion
                } else {
                    // Déconnectez l'utilisateur
                    const { error } = await supabase.auth.signOut();

                    if (error) {
                        console.error("Erreur lors de la déconnexion :", error.message);
                        // Gérer les erreurs de déconnexion
                    } 
                }
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
            // Gérer les erreurs
        }
    };

    return (
        <nav className='sideBar'>
            <div className='structure'>
                <div id='space'>
                    <img src={box} className='box' alt="Box icon" />
                    <div className='link'>
                        <NavLink to="/dash" className='Place'>
                            <img src={dashbord} className='icons' alt="Dashboard icon" />Dashboard
                        </NavLink>
                        <NavLink to="/inventory" className='Place' >
                            <img src={inventory} className='icons' alt="Inventory icon" />Inventory
                        </NavLink>
                        <NavLink to="/reports" className='Place'>
                            <img src={report} className='icons' alt="Reports icon" />Reports
                        </NavLink>
                        <NavLink to="/suppliers" className='Place'>
                            <img src={supplier} className='icons' alt="Suppliers icon" />Suppliers
                        </NavLink>
                        <NavLink to="/orders" className='Place'>
                            <img src={order} className='icons' alt="Orders icon" />Orders
                        </NavLink>
                        <NavLink to="/store" className='Place'>
                            <img src={store} className='icons' alt="Manage Store icon" />Manage Store
                        </NavLink>
                        <NavLink to="/users" className='Place'>
                            <img src={user} className='icons' alt="Manage Store icon" />Users
                        </NavLink>
                    </div>
                </div>
                <div className='link'>
                    <NavLink to="/settings" className='Place'>
                        <img src={setting} className='icons' alt="Settings icon" />Settings
                    </NavLink>
                    <NavLink to="/" onClick={handleLogout} className='Place'>
                        <img src={logOut} className='icons' alt="Logout icon" />Log Out
                    </NavLink>
                </div>
            </div>
            {children}
        </nav>
    );
}

export default Sidebar;

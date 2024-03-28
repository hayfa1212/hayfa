import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import box from '../Assets/box.png';
import './sideBar.css';
import dashbord from '../Assets/dashbord.png';
import inventory from '../Assets/inventory.png';
import report from '../Assets/report.png';
import order from '../Assets/order.png';
import supplier from '../Assets/livreur.png';
import store from '../Assets/magasin.png';
import setting from '../Assets/parametres.png';
import logOut from '../Assets/deconnexion.png';
import supabase from '../utils/api';
import user from "../Assets/utilisateur.png"

interface SidebarProps {
    children?: ReactNode;
}
const handelLogout= async()=>{
    
const { error } = await supabase.auth.signOut()

}

export default function Sidebar({ children }: SidebarProps) {
    return (
        <nav className='sideBar'>
            <div className='structure'>
            <div className='link'>
                <img src={box} className='box' alt="Box icon" />
                <NavLink to="/dash">
                    <img src={dashbord} className='icons' alt="Dashboard icon" />Dashboard
                </NavLink>
                <NavLink to="/inventory" className="dis">
                    <img src={inventory} className='icons' alt="Inventory icon" />Inventory
                </NavLink>
                <NavLink to="/reports">
                    <img src={report} className='icons' alt="Reports icon" />Reports
                </NavLink>
                <NavLink to="/suppliers">
                    <img src={supplier} className='icons' alt="Suppliers icon" />Suppliers
                </NavLink>
                <NavLink to="/orders">
                    <img src={order} className='icons' alt="Orders icon" />Orders
                </NavLink>
                <NavLink to="/store">
                    <img src={store} className='icons' alt="Manage Store icon" />Manage Store
                </NavLink>
                <NavLink to="/users">
                    <img src={user} className='icons' alt="Manage Store icon" />Users
                </NavLink>
            </div>
            <div className='link'>
                <NavLink to="/settings">
                    <img src={setting} className='icons' alt="Settings icon" />Settings
                </NavLink>
                <NavLink to="/" onClick={handelLogout}>
                    <img src={logOut} className='icons' alt="Logout icon" />Logout
                </NavLink>
            </div>
            </div>
            {children}
        </nav>
    );
}

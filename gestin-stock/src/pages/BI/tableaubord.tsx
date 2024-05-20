import React from 'react';

import Achat from "./achat";
import Product from "./prodinfo";
import Sales from "./sales";
import SupplierStats from "./supplierinfo";
import TotalOrderValue from "./grap2";
import ProductTable from "./graph";
import CommandesLivreesParMois from "./graph3";
import './tb.css';
import notif from '../../Assets/notification.png';
import imprime from '../../Assets/imprimante.png'

export default function Tableubord() {

    // Fonction pour imprimer le tableau de bord
    const handlePrintDashboard = () => {
        window.print(); // Appel de la fonction d'impression du navigateur
    };

    return (
        <div className="bi">
            
            <div className="searchBar">
                <input type="search" className="search" placeholder="Search" />
                <div className='impr'>
                <img src={notif} className="notif" />
                <img src={imprime} className='imprime'  onClick={handlePrintDashboard}/>
                </div>
                </div>
              
            <div className="tbs">
                <div id="tb">
                    <Sales />
                    <Achat />
                </div>
                <div id="tb">
                    <Product />
                    <SupplierStats />
                </div>
            </div>
            <div className="tbs">
                <TotalOrderValue />
                <ProductTable />
                <CommandesLivreesParMois />
            </div>
      
        </div>
    );
}

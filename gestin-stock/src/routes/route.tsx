import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Account from "../pages/auth/creeCompte";
import Authentifier from "../pages/auth/authentifier";
import Verifier from "../pages/auth/verification";
import Notfound from "../pages/notFound";
import VerifierAccount from "../pages/auth/accountVerification";
import Consulterprod from "../pages/produit/consulterProduit";
import Sidebar from "../sideBar/sidebar";
import './route.css'
import ConsulterFournisseur from "../pages/supplier/consulterSupplier";
import Adduser from "../pages/users/addUser";
import ConsulterUsers from "../pages/users/consulterUser";
import ProductDetails from "../pages/produit/singleProd";
import  { Resetpass } from "../pages/auth/restPass";
import { Forgot } from "../pages/auth/forgotpass";

import Consultentrepot from "../pages/entrepot/consulterEntrepot";

import ConsultUsers from "../pages/users/test";
import ConsulterCommande from "../pages/order/suivieorders";
import ChartComponent from "../pages/BI/graph";
import OrderDetails from "../pages/order/singleOrder";

import ThresholdComponent from "../pages/notif";
import CommandeTable from "../pages/BI/grap2";
import StarRating from "../pages/reat";
import RatingReview from "../pages/reat";
import MonthlyOrderChart from "../pages/BI/graph3";
import Summary from "../pages/order/summary";
import OrdersCounter from "../pages/order/summary";
import SupplierStats from "../pages/BI/supplierinfo";
import ProductAndOrderStats from "../pages/BI/prodinfo";
import Sales from "../pages/BI/sales";
import Achat from "../pages/BI/achat";
import Tableubord from "../pages/BI/tableaubord";
import Profites from "../pages/BI/graph4";



// Importez le composant des détails du produit

export default function AppRoutes() {
 
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <React.Fragment>
              <Authentifier />
            </React.Fragment>
          }
        />
        <Route path="/Account" element={<Account />} />
        <Route path="/verification" element={<Verifier />} />
        <Route path="/verifieAccount" element={<VerifierAccount />} />
        <Route path="/Restpass" element={<Resetpass/>} />
        <Route path="/frogot" element={<Forgot/>} />
        
        <Route
          path="/*"
          element={
            <React.Fragment>
              <div className="formroute">
                <Sidebar />
                <div>
                  <Routes>
                  <Route path="/profit" element={<Profites />} />
                  <Route path="/dash" element={<Tableubord />} />
                    <Route path="/inventory" element={<Consulterprod />} />
                    <Route path="/suppliers" element={<ConsulterFournisseur />} />
                    <Route path="/store" element={<Consultentrepot />} />
                    <Route path="/users" element={<ConsulterUsers />} />
                    <Route path="/orders" element={<ConsulterCommande/>} />
                    <Route path="/orders/:orderId" element={<OrderDetails/>} />
                    <Route path="*" element={<Notfound />} />
                    <Route path="/graph" element={<ChartComponent/>} />
                    <Route path="/test" element={<ConsultUsers/>} />
                    <Route path="/product/:productId" element={<ProductDetails />} /> {/* Nouvelle route pour les détails du produit */}
                    
                  </Routes>
                </div>
                
              </div>
             
            </React.Fragment>
          }
          
        />
      </Routes>
      
    </Router>
  );
}

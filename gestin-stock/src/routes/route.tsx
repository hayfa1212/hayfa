import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
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
import Addstore from "../pages/entrepot/ajoutEntrepot";
import Consultentrepot from "../pages/entrepot/consulterEntrepot";

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
                    <Route path="/inventory" element={<Consulterprod />} />
                    <Route path="/suppliers" element={<ConsulterFournisseur />} />
                    <Route path="/store" element={<Consultentrepot />} />
                    <Route path="/users" element={<ConsulterUsers />} />
                    <Route path="/product/:productId" element={<ProductDetails />} /> {/* Nouvelle route pour les détails du produit */}
                    <Route path="*" element={<Notfound />} />
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

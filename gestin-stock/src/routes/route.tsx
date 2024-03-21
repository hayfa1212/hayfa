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
import Ajoutsupplier from "../pages/supplier/ajoutSupplier";
import ConsulterFournisseur from "../pages/supplier/consulterSupplier";

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

import { BrowserRouter as Router , Routes,Route } from "react-router-dom"
import Account from "../pages/auth/creeCompte"
import Authentifier from "../pages/auth/authentifier"
import Verifier from "../pages/auth/verification"
import Notfound from "../pages/notFound"
import VerifierAccount from "../pages/auth/accountVerification"

import Search from "../searchBar"
import Ajoutproduit from "../pages/produit/ajoutProduit"
import Consulterprod from "../pages/produit/consulterProduit"
import Sidebar from "../sideBar/sidebar"






export default function AppRoutes(){

    return (
        <Router>
  
        <Routes>
        <Route path="/" element={ <Authentifier/>}/> 
                <Route path="/Account" element={<Account/>}/> 
               < Route path="/verification" element={<Verifier/>}/> 
               <Route path="/verifieAccount" element={<VerifierAccount/>}/>
            
        </Routes>
        <div>
            <Sidebar>
            <Routes>
             
            <Route path="/inventory" element={<Consulterprod/>}/>
                
            
               <Route path="*" element={<Notfound/>}/>
            </Routes>
            </Sidebar>
            </div>
        </Router>
    )
}
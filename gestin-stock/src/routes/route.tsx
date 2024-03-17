import { BrowserRouter as Router , Routes,Route } from "react-router-dom"
import Account from "../pages/auth/creeCompte"
import Authentifier from "../pages/auth/authentifier"
import Verifier from "../pages/auth/verification"
import Notfound from "../pages/notFound"
import VerifierAccount from "../pages/auth/accountVerification"
import Sidebar from "../sideBar"
import Search from "../searchBar"
import Ajoutproduit from "../pages/produit/ajoutProduit"
import Consulterprod from "../pages/produit/consulterProduit"





export default function AppRoutes(){

    return (
        <Router>
      
            <Routes>
                <Route path="/" element={ <Authentifier/>}/> 
                <Route path="/Account" element={<Account/>}/> 
               < Route path="/verification" element={<Verifier/>}/> 
               <Route path="/verifieAccount" element={<VerifierAccount/>}/>
               <Route path="/consulterprod" element={<Consulterprod/>}/>
               <Route path="/ajout" element={<Ajoutproduit/>}/>
               <Route path="*" element={<Notfound/>}/>
            </Routes>
        
        </Router>
    )
}
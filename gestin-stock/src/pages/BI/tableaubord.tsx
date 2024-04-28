import SearchInput from "../../searchBar";
import Achat from "./achat";
import Product from "./prodinfo";
import Sales from "./sales";
import SupplierStats from "./supplierinfo";
import './tb.css'
import notif from '../../Assets/notification.png'
import TotalOrderValue from "./grap2";
import ProductTable from "./graph";
import CommandesLivreesParMois from "./graph3";

export default function Tableubord() {
    return (
        <div  className="bi"> 
            <div className="searchBar">
        <input type="search" className="search" placeholder="Search" />
        <img src={notif} className="notif" />
      </div>
            <div className="tbs">
        <div id="tb">
            <Sales/>
            <Achat/>
          
            </div>
            <div id="tb">
            <Product/>
                <SupplierStats/>
            </div>
           
            
            </div>
            <div className="tbs">
                <TotalOrderValue/>
                <ProductTable/>
                <CommandesLivreesParMois/>
            </div>
        </div>
    );
}

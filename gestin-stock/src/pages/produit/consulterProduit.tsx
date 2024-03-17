import Search from "../../searchBar";
import Sidebar from "../../sideBar";
import supabase from "../../utils/api";
import './consulterProduit.css'

export default function Consulterprod(){
    const fetch =async()=>{     
const { data, error } = await supabase
.from('product')
.select()
    }
    console.log(fetch)

    return(
        <div className="home">

             <Sidebar/>
            
        </div>
    )
}
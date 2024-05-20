import Productprofit from "./exemple";
import Productsale from "./graph4";
import imprime from '../../Assets/imprimante.png'
export default function TBD(){
     // Fonction pour imprimer le tableau de bord
     const handlePrintDashboard = () => {
        window.print(); // Appel de la fonction d'impression du navigateur
    };

    return(
        
           <div>
             <img src={imprime} className='imprime'  onClick={handlePrintDashboard} style={{
                marginLeft:"70rem"
             }}/>
            <div className="tbs">
          <Productprofit/>
            <Productsale/>
            </div>
           
            
        </div>
    )
}
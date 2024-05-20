import React, { useState, useEffect } from 'react';
import supabase from '../../utils/api';
import quantity from '../../Assets/Quantity.png'
import recived from '../../Assets/On the way.png'
import '../BI/suppinfo.css'
import flech from '../../Assets/fleche-droite.png'
import { NavLink } from 'react-router-dom';


const Product: React.FC = () => {
  const [totalProductQuantity, setTotalProductQuantity] = useState<number>(0);
  
  const [totalSupplierQuantity, setTotalSupplierQuantity] = useState<number>(0); // Nouveau state pour la quantité de type fournisseur

  useEffect(() => {
    const fetchStats = async () => {
      // Récupérer le total des quantités dans la table "produit" pour tous les produits
      const { data: productData, error: productError } = await supabase
        .from('product')
        .select('quantity')
       

      if (productError) {
        console.error('Erreur lors de la récupération des quantités de produit:', productError.message);
        return;
      }

      if (productData) {
        const totalQuantity = productData.reduce((acc: number, product: any) => acc + product.quantity, 0);
        setTotalProductQuantity(totalQuantity);
      }

     

      // Récupérer le total des quantités de type fournisseur dans la table "produit"
      const { data: supplierData, error: supplierError } = await supabase
      .from('commande')
      .select('quantity')
      .neq('status', 'Returned')
      .neq('status', 'Confirmed')
      .eq('type', 'Supplier')
       // Filtrer par type fournisseur

      if (supplierError) {
        console.error('Erreur lors de la récupération des quantités de type fournisseur:', supplierError.message);
        return;
      }

      if (supplierData) {
        console.log(supplierData)
        const totalQuantity = supplierData.reduce((acc: number, product: any) => acc + product.quantity, 0);
        setTotalSupplierQuantity(totalQuantity);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='font'>
<div className='head'>
       <p id="inve">Inventory Summary</p>
      <NavLink to={'/tb'}> <img src={flech} style={{
        width:"2rem",height:"2rem"
       }}/>
       </NavLink>
       </div>
       <div className='supp-info'>
       <div>
       <img src={quantity}/>
      <p className='vale'> {totalProductQuantity}</p>
      <p className='num'>Quantity in hand</p>
     </div>
     <p className="bar"></p>
     <div>
      <img src={recived} className='cate'/>
      <p className='vale'>{totalSupplierQuantity}</p>
      <p className='num'>To be recived</p>
      </div>
      </div>
    </div>
  );
};

export default Product;

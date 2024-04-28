import React, { useState, useEffect } from 'react';
import supabase from '../../utils/api';
import cance from '../../Assets/Cancel.png'
import cost from '../../Assets/Cost.png'
import achat from '../../Assets/Purchase (1).png'
import retur from '../../Assets/Profit.png'
import '../BI/suppinfo.css'
import './sales.css'


const Achat: React.FC = () => {
  const [totalSupplierQuantity, setTotalSupplierQuantity] = useState<number>(0);
  const [totalSupplierOrderValue, setTotalSupplierOrderValue] = useState<number>(0);
  const [totalReturnedQuantity, setTotalReturnedQuantity] = useState<number>(0);
  const [totalReturnedOrderValue, setTotalReturnedOrderValue] = useState<number>(0);
  const [nmbr, setnmbr] = useState<number>(0);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupération des commandes de type fournisseur
        const { data: supplierData, error: supplierError } = await supabase
          .from('commande')
          .select('quantity, orderValue')
          .eq('status', 'Confirmed')
          .eq('type', 'Supplier');

        if (supplierError) {
          throw new Error('Erreur lors de la récupération des données fournisseur:');
        }

        if (supplierData) {
          const totalSupplierQuantity = supplierData.reduce((acc: number, order: any) => acc + order.quantity, 0);
          setTotalSupplierQuantity(totalSupplierQuantity);

          const totalSupplierOrderValue = supplierData.reduce((acc: number, order: any) => acc + order.orderValue, 0);
          setTotalSupplierOrderValue(totalSupplierOrderValue);
        }

        // Récupération des commandes de type returned
        const { data: returnedData, error: returnedError } = await supabase
          .from('commande')
          .select('quantity, orderValue')
          .eq('status', 'Returned')
          .eq('type', 'Supplier');

        if (returnedError) {
          throw new Error('Erreur lors de la récupération des données returned:');
        }

        if (returnedData) {
            const nmbr=returnedData.length;
            setnmbr(nmbr);
          const totalReturnedQuantity = returnedData.reduce((acc: number, order: any) => acc + order.quantity, 0);
          setTotalReturnedQuantity(totalReturnedQuantity);

          const totalReturnedOrderValue = returnedData.reduce((acc: number, order: any) => acc + order.orderValue, 0);
          setTotalReturnedOrderValue(totalReturnedOrderValue);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='fonte'>
      <p id="inve">Purchase Overview</p>
      <div className='sales-info'>
      <div>
        <img src={achat}/>
        <div className='info'>
      <p className="number"> {totalSupplierQuantity}</p>
      <p className="note">Purchase</p>
      </div>
      </div>
      <p className="bar"></p>
      <div>
        <img src ={cost}/>
        <div className='info'>
      <p className="number">{totalSupplierOrderValue}</p>
      <p className="note">Cost</p>
      </div>
      </div>
      <p className="bar"></p>
     <div>
     <img src ={cance}/>
     <div className='info'>
      <p className="number">{totalReturnedQuantity}</p>
      <p className="note">Cancel</p>
      </div>
      </div>
      <p className="bar"></p>
    <div>
      <img src ={retur}/>
      <div className='info'>
      <p className="number"> {totalReturnedOrderValue}</p>
      <p className="note">Return</p>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Achat;

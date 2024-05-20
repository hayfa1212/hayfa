import React, { useState, useEffect } from 'react';
import supabase from '../../utils/api';
import cost from '../../Assets/Cost.png'
import revenue from '../../Assets/Revenue.png'
import profite from '../../Assets/Profit.png'
import sales from '../../Assets/Sales.png'
import '../BI/suppinfo.css'
import './sales.css'

const Sales: React.FC = () => {
 
  const [totalCustomerQuantity, setTotalCustomerQuantity] = useState<number>(0);
  const [totalOrderValue, setTotalOrderValue] = useState<number>(0);
  const [totalPurchasePrice, setTotalPurchasePrice] = useState<number>(0); // Nouvelle variable pour stocker le prix total des achats
  const [profit, setProfit] = useState<number>(0);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer le total des quantités de type client dans la table "commande"
        const { data: customerData, error: customerError } = await supabase
          .from('commande')
          .select('quantity')
          .eq('status', 'Confirmed')
          .eq('type', 'Client');

        if (customerError) {
          throw new Error('Erreur lors de la récupération des quantités de type client:');
        }

        if (customerData) {
          const totalCustomerQuantity = customerData.reduce((acc: number, order: any) => acc + order.quantity, 0);
          setTotalCustomerQuantity(totalCustomerQuantity);
        }

        // Récupérer le total de la valeur des commandes de type client
        const { data: customerOrderData, error: customerOrderError } = await supabase
          .from('commande')
          .select('orderValue')
          .eq('status', 'Confirmed')
          .eq('type', 'Client');

        if (customerOrderError) {
          throw new Error('Erreur lors de la récupération des commandes de type client:');
        }

        if (customerOrderData) {
          const totalValue = customerOrderData.reduce((acc: number, order: any) => acc + order.orderValue, 0);
          setTotalOrderValue(totalValue);
        }

        // Récupérer les prix d'achat et les quantités de chaque commande
        const { data: orders, error: orderError } = await supabase
          .from('commande')
          .select('quantity, product')
          .eq('status', 'Confirmed')
          .eq('type', 'Client');

        if (orderError) {
          throw new Error('Erreur lors de la récupération des commandes:');
        }

        if (orders) {
            console.log(orders)
          let totalPrice = 0;
          for (const order of orders) {
            const { data: product, error: productError } = await supabase
              .from('product')
              .select('buying_price')
              .eq('product_Name', order.product)
              .single();

            if (productError) {
              throw new Error('Erreur lors de la récupération du prix du produit:');
            }

            if (product) {
                
              totalPrice += product.buying_price * order.quantity; // Calcul du prix total des achats
            }
          }
          setTotalPurchasePrice(totalPrice);
          const profit=totalOrderValue-totalPrice
          setProfit(profit)
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);
  

  return (
    <div className='fonte'>
     <p id="inve">Sales Overview</p>
     <div  className='sales-info'>
      <div>
      <img src={sales}/>
      <div>
        <div className='info'>
      <p className="number"> {totalCustomerQuantity}</p>
      <p  className="note">Revenue</p> 
      </div>
      </div>
      </div>
      <p className="bar"></p>
      <div>
      <img src={revenue}/>
      <div className='info'>
      <p className="number"> {totalOrderValue}</p>
      <p  className="note">Sales</p> 
      </div>
      </div>
      <p className="bar"></p>
    <div>
    <img src={profite}/>
    <div className='info'>
      <p className="number"> {profit}</p> 
      <p  className="note">Profit</p> 
      </div>
      </div>
      <p className="bar"></p>

      <div >
      <img src={cost}/>
      <div className='info'>
      <p className="number"> {totalPurchasePrice}</p>
      <p  className="note">Cost</p> 
      </div>
      </div>
      </div>
    </div>
  );
};

export default Sales;

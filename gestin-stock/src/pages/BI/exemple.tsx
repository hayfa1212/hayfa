import React, { useState, useEffect } from 'react';
import supabase from '../../utils/api';
import cost from '../../Assets/Cost.png';
import fleche from '../../Assets/la-fleche.png'
import profite from '../../Assets/Profit.png';
import sales from '../../Assets/Sales.png';
import '../BI/suppinfo.css';
import './sales.css';
import './exemple.css';
import { NavLink } from 'react-router-dom';
//tablaux profit
const Productprofit: React.FC = () => {
  const [productsData, setProductsData] = useState<any[]>([]);
  const [showAllProducts, setShowAllProducts] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: orders, error: orderError } = await supabase
          .from('commande')
          .select('*')
          .eq('status', 'Confirmed')
          .eq('type', 'Client');

        if (orderError) {
          throw new Error('Erreur lors de la récupération des commandes:');
        }

        if (orders) {
          let productsMap: { [key: string]: any } = {};

          for (const order of orders) {
            const { data: productData, error: productError } = await supabase
              .from('product')
              .select('buying_price')
              .eq('product_Name', order.product)
              .single();

            if (productError) {
              throw new Error('Erreur lors de la récupération du prix du produit:');
            }

            if (productData) {
              const totalPrice = productData.buying_price * order.quantity;
              const profit = order.orderValue - totalPrice;

              if (productsMap[order.product]) {
               
                productsMap[order.product].sales += order.orderValue;
                productsMap[order.product].cost += totalPrice;
                productsMap[order.product].profit += profit;
              } else {
                productsMap[order.product] = {
                  productName: order.product,
                  sales: order.orderValue,
                  cost: totalPrice,
                  profit: profit,
                };
              }
            }
          }

          const productsArray = Object.values(productsMap);
          productsArray.sort((a, b) => b.sales - a.sales);

          if (showAllProducts) {
            setProductsData(productsArray);
          } else {
            // Afficher seulement les 10 premiers produits
            setProductsData(productsArray.slice(0, 10));
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [showAllProducts]);

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  return (
    <div className='salesOverview'>
    
           <NavLink to={"/dash"}> <img src={fleche} style={{
            width:"2rem",height:"2rem",marginRight:"28rem"
           }}/></NavLink>
               <div className='head'>
      <p id="inve">Sales Overview</p>
      {!showAllProducts && (
        <p onClick={toggleShowAllProducts} className='see'>See more</p>
      )}
      </div>
      <table className='statistics'>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Sales <img src={sales} alt="Sales" /></th>
            <th>Cost <img src={cost} alt="Cost" /></th>
            <th>Profit <img src={profite} alt="Profit" /></th>
          </tr>
        </thead>
        <tbody>
          {productsData.map((product, index) => (
            <tr key={index}>
              <td  className="note">{product.productName}</td>
              <td>
                <span  className="number">{product.sales}</span>
              </td>
              <td>
                <span  className="number">{product.cost}</span>
              </td>
              <td>
                <span  className="number">{product.profit}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      
    </div>
  );
};

export default Productprofit;

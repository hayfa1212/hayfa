import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import supabaseClient from '../../utils/api';
import './sales.css';

const Productsale: React.FC = () => {
  const [productTotalOrderValue, setProductTotalOrderValue] = useState<{ productName: string; totalOrderValue: number }[]>([]);

  useEffect(() => {
    const fetchTotalOrderValue = async () => {
      try {
        const { data: orders, error: ordersError } = await supabaseClient
          .from('commande')
          .select('product, orderValue')
          .eq('status', 'Confirmed')
          .neq('type', 'Supplier');
          
        if (ordersError) {
          throw new Error('Erreur lors de la récupération des commandes: ' + ordersError.message);
        }

        if (orders) {
          const productOrderValueMap: { [key: string]: number } = {};

          for (const order of orders) {
            const { product, orderValue } = order;
            if (!productOrderValueMap[product]) {
              productOrderValueMap[product] = orderValue;
            } else {
              productOrderValueMap[product] += orderValue;
            }
          }

          const productTotalOrderValueArray = Object.entries(productOrderValueMap)
            .map(([productName, totalOrderValue]) => ({
              productName,
              totalOrderValue,
            }))
            .sort((a, b) => b.totalOrderValue - a.totalOrderValue) // Tri par valeur décroissante
            .slice(0, 10); // Limite à 10 éléments

          setProductTotalOrderValue(productTotalOrderValueArray);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTotalOrderValue();
  }, []);

  // Tableau de couleurs assorties mais fixes
  const colors = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#00FF7F", "#4682B4", "#FFD700", "#32CD32", "#FF6347"];

  // Préparer les données pour le graphique en barres
  const chartData = {
    labels: productTotalOrderValue.map(item => item.productName),
    datasets: [
      {
        label: 'Product Revenue',
        data: productTotalOrderValue.map(item => item.totalOrderValue),
        backgroundColor: colors, // Utilisation du tableau de couleurs
        borderColor: 'rgba(0, 0, 0, 0)', // Pas de bordure
        borderWidth: 0.5,
        barThickness: 20,
        barSpacing: 0.1, 
      },
    ],
  };

 
  return (
    <div  className='graph' style={{marginTop:"1rem",height:"20rem"}}>
      <p id="inve">Best selling product</p>
      <div className='sales-info'>
        <Bar data={chartData}  />
      </div>
    </div>
  );
};

export default Productsale;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import supabaseClient from '../../utils/api';
import './sales.css';

const TotalOrderValue: React.FC = () => {
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

  // Préparer les données pour le graphique en barres
  const chartData = {
    labels: productTotalOrderValue.map(item => item.productName),
    datasets: [
      {
        label: 'Total des ventes par produit',
        data: productTotalOrderValue.map(item => item.totalOrderValue),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div >
      <p id="inve">Total des ventes par produit (Top 10)</p>
      <div className='sales-info'>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default TotalOrderValue;

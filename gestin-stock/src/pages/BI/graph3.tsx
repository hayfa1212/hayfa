import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import supabase from '../../utils/api';
import './graph3.css'

const CommandesLivreesParMois: React.FC = () => {
  const [commandes, setCommandes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCommandes() {
      try {
        const { data, error } = await supabase.from('commande').select('*');

        if (error) {
          console.error('Erreur lors de la récupération des commandes:', error.message);
          return;
        }

        if (data) {
          console.log(data);
          setCommandes(data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCommandes();
  }, []);

  const calculerTotalCommandesParMois = () => {
    const totalParMois: { [mois: string]: { total: number, confirmed: number } } = {};

    commandes.forEach(commande => {
      const dateLivraison = new Date(commande.dateDelivery);
      const mois = `${dateLivraison.getMonth() + 1}/${dateLivraison.getFullYear()}`;

      if (!totalParMois[mois]) {
        totalParMois[mois] = { total: 0, confirmed: 0 };
      }

      totalParMois[mois].total++;
      if (commande.status === 'Confirmed') {
        totalParMois[mois].confirmed++;
      }
    });
    

    return totalParMois;
  };

  const totalCommandesLivrees = calculerTotalCommandesParMois();

  const labels = Object.keys(totalCommandesLivrees);
  const totalValues = Object.values(totalCommandesLivrees).map((value: any) => value.total);
  const confirmedValues = Object.values(totalCommandesLivrees).map((value: any) => value.confirmed);
  const diff = totalValues.map((value: number, index: number) => value - confirmedValues[index]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Ordered',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: totalValues,
        
      },
      {
        label: 'Delivered',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: confirmedValues,
        
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
         
        },
      ],
    },
  };

  if (loading) {
    return (
      <div className='spinner '>
        <div ></div>
      </div>
    );}

  return (
    <div className='graph'>
      <p>Order Summary</p>
      <Line data={data} />
    </div>
  );
};

export default CommandesLivreesParMois;

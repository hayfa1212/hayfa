import React, { useEffect, useRef, useState } from 'react';
import Chart, { ChartOptions } from 'chart.js/auto';
import supabase from '../../utils/api';

const fetchCommandData = async (selectedProduct = '') => {
  try {
    let { data: commandData, error } = await supabase.from('commande').select('*');

    if (error) {
      throw new Error('Failed to fetch data');
    }

    // Vérifier si commandData est null avant de filtrer
    if (commandData) {
      // Filtrer les données en fonction du produit sélectionné
      if (selectedProduct) {
        commandData = commandData.filter(item => item.product === selectedProduct);
      }

      return commandData.map((item: any) => ({
        month: item.dateDelivery.slice(0, 7),
        type: item.type,
        buyingPrice: item.price * item.quantity
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching command data:', error);
    return [];
  }
};

const fetchProducts = async () => {
  try {
    const { data: products, error } = await supabase.from('commande').select('product');
    console.log(products)
    if (error) {
      throw new Error('Failed to fetch products');
     
    }
    return products.map((product: any) => product.name);
   
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};


const ChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [commandData, setCommandData] = useState<{ month: string, type: string, buyingPrice: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>(''); // État pour stocker le produit sélectionné
  const [products, setProducts] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCommandData(selectedProduct); // Utiliser le produit sélectionné dans la requête
      setCommandData(data);
    };

    fetchData();
  }, [selectedProduct]); // Mettre à jour les données lorsque le produit sélectionné change

  useEffect(() => {
    // Récupérer la liste des produits
    fetchProducts().then(products => {
      setProducts(products);
    });
  }, []); // Récupérer la liste des produits au chargement initial uniquement

  useEffect(() => {
    if (chartRef && chartRef.current && commandData.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const monthlyData: { [month: string]: { [type: string]: number } } = {};

        commandData.forEach(item => {
          if (!monthlyData[item.month]) {
            monthlyData[item.month] = {};
          }

          if (!monthlyData[item.month][item.type]) {
            monthlyData[item.month][item.type] = 0;
          }

          monthlyData[item.month][item.type] += item.buyingPrice;
        });

        const labels = Object.keys(monthlyData).sort(); // Tri des mois
        const datasets = Object.keys(monthlyData[labels[0]]).map(type => ({
          label: `Total Prix d'Achat pour Commandes ${type}`,
          data: labels.map(month => monthlyData[month][type] || 0),
          backgroundColor: type === 'Client' ? 'rgba(255, 99, 132, 0.2)' : 'rgba(54, 162, 235, 0.2)',
          borderColor: type === 'Client' ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }));

        const options: ChartOptions<'bar'> = {
          scales: {
            y: {
              type: 'linear',
              ticks: {}
            }
          }
        };

        const myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: datasets
          },
          options: options
        });

        return () => {
          myChart.destroy();
        };
      }
    }
  }, [commandData]);

  const handleProductSelect = (product: string) => {
    setSelectedProduct(product);
  };

  return (
    <div style={{ width: '800px', height: '600px' }}>
      {/* Bouton de sélection du produit */}
      <div>
        <select onChange={(e) => handleProductSelect(e.target.value)}>
          <option value="">Tous les produits</option>
          {products.map((product, index) => (
            <option key={index} value={product}>{product}</option>
          ))}
        </select>
      </div>

      <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default ChartComponent;

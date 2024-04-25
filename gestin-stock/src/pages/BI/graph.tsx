import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto'; // Importez Chart.js
import supabase from '../../utils/api';

interface Product {
  product: string; // Assurez-vous que cela correspond au nom de la colonne dans votre base de données
  quantity: number;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null); // Référence à l'élément canvas pour le graphique
  const chartInstance = useRef<Chart<"pie", number[], string> | null>(null); // Référence au graphique actuel

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('commande').select('product, quantity');

      if (error) {
        console.error('Error fetching products:', error.message);
        return;
      }

      // Calculate total quantity for each product
      const productMap = new Map<string, number>();
      data.forEach((item: Product) => {
        if (productMap.has(item.product)) {
          productMap.set(item.product, productMap.get(item.product)! + item.quantity);
        } else {
          productMap.set(item.product, item.quantity);
        }
      });

      // Sort products by total quantity in descending order
      const sortedProducts = Array.from(productMap.entries()).sort((a, b) => b[1] - a[1]);

      // Take the top 3 products
      const topProducts = sortedProducts.slice(0, 4).map(([product, quantity]) => ({ product, quantity }));

      setProducts(topProducts);

      // Destroy the existing chart if there is one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create the pie chart once data is loaded
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
          chartInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: topProducts.map(product => product.product),
              datasets: [{
                label: 'Total Quantity',
                data: topProducts.map(product => product.quantity),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.8)', // Rouge avec opacité plus élevée
              'rgba(54, 162, 235, 0.8)', // Bleu avec opacité plus élevée
              'rgba(255, 206, 86, 0.8)', // Jaune avec opacité plus élevée
              'rgba(75, 192, 192, 0.8)' 
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.product}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ width: '400px', height: '400px' }}>
        <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default ProductTable;

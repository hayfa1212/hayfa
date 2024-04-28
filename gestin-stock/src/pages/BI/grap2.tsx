import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import supabase from '../../utils/api';

interface Commande {
  id?: number; // Rendre id facultatif
  orderValue: number;
  type: string; // "client" ou "supplier"
  dateDelivery: string; // Date de livraison
}

const TotalOrderValue: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<{ month: string; clientValue: number; supplierValue: number }[]>([]);

  const fetchData = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('commande')
        .select('orderValue, type, dateDelivery');

      if (error) {
        throw error;
      }

      if (orders) {
        // Group orders by month
        const ordersByMonth: { [month: string]: Commande[] } = {};
        orders.forEach(order => {
          const month = new Date(order.dateDelivery).toLocaleString('default', { month: 'long' });
          if (!ordersByMonth[month]) {
            ordersByMonth[month] = [];
          }
          ordersByMonth[month].push(order);
        });

        // Calculate total values for each month
        const orderData: { month: string; clientValue: number; supplierValue: number }[] = [];
        for (const month in ordersByMonth) {
          const clientOrders = ordersByMonth[month].filter(order => order.type === 'Client');
          const supplierOrders = ordersByMonth[month].filter(order => order.type === 'Supplier');
          const totalClientValue = clientOrders.reduce((acc, order) => acc + order.orderValue, 0);
          const totalSupplierValue = supplierOrders.reduce((acc, order) => acc + order.orderValue, 0);
          orderData.push({ month, clientValue: totalClientValue, supplierValue: totalSupplierValue });
        }

        setOrderData(orderData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
    const interval = setInterval(fetchData, 60000); // Fetch data every minute
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const labels = orderData.map(data => data.month);
  const clientValues = orderData.map(data => data.clientValue);
  const supplierValues = orderData.map(data => data.supplierValue);

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: clientValues,
      },
      {
        label: 'Purchase',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: supplierValues,
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
      <div className="spinner ">
        <div ></div>
      </div>
    );
  }

  return (
    <div className='graph'>
<p >Sales & Purchase</p>
      <Bar data={data} />
    </div>
  );
};

export default TotalOrderValue;

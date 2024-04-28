import React, { useState, useEffect } from 'react';
import supabase from '../../utils/api';
import './summary.css'
const OrdersCounter: React.FC = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [confirmedOrders, setConfirmedOrders] = useState<number>(0);
  const [returnedOrders, setReturnedOrders] = useState<number>(0);
  const [otherOrders, setOtherOrders] = useState<number>(0);
  const [confirmedOrderValue, setConfirmedOrderValue] = useState<number>(0);
  const [returnedOrderValue, setReturnedOrderValue] = useState<number>(0);
  const [otherOrderValue, setOtherOrderValue] = useState<number>(0);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const { data: allOrdersData, error: allOrdersError } = await supabase
          .from('commande')
          .select('id, status, orderValue');

        if (allOrdersError) {
          throw allOrdersError;
        }

        if (allOrdersData) {
          setTotalOrders(allOrdersData.length);

          const confirmedOrdersData = allOrdersData.filter(order => order.status === 'Confirmed');
          setConfirmedOrders(confirmedOrdersData.length);

          const returnedOrdersData = allOrdersData.filter(order => order.status === 'Returned');
          setReturnedOrders(returnedOrdersData.length);

          const otherOrdersData = allOrdersData.filter(order => order.status !== 'Confirmed' && order.status !== 'Returned');
          setOtherOrders(otherOrdersData.length);

          const totalConfirmedValue = confirmedOrdersData.reduce((acc, order) => acc + order.orderValue, 0);
          setConfirmedOrderValue(totalConfirmedValue);

          const totalReturnedValue = returnedOrdersData.reduce((acc, order) => acc + order.orderValue, 0);
          setReturnedOrderValue(totalReturnedValue);

          const totalOtherValue = otherOrdersData.reduce((acc, order) => acc + order.orderValue, 0);
          setOtherOrderValue(totalOtherValue);
        }
      } catch (error) {
        console.error('Error fetching orders data:', error);
      }
    };

    fetchOrdersData();
  }, []);

  return (
    <div className='sum'>
        <p id="inve">Overall Orders</p>
        <div className='info-general'>
            <div>
      <p id="categ">Total Orders</p>
      <div className='valu'>
      <p  className="number"> {totalOrders}</p>
      <p className="note">Last 7 days</p>
      </div>
      
      </div>
      <p className="bar"></p>
      <div>
      <p id="totl">Total Received</p>
      <div className="totale">
        <div>
      <p  className="number"> {confirmedOrders}</p>
      <p className="note">Last 7 days</p>
      </div>
      <div>
      <p  className="number"> {confirmedOrderValue}</p>
      <p className="note">Revenue</p>
      </div>
      </div>
      </div>
      <p className="bar"></p>
      <div>
      <p className='return'>Total Returned</p>
      <div className="totale">
        <div>
      <p  className="number" > {returnedOrders}</p>
      <p className="note">Last 7 days</p>
      </div>
      <div>
      <p  className="number"> {returnedOrderValue}</p>
      <p className="note">Revenue</p>
      </div>
      </div>
      </div>
      <p className="bar"></p>
      <div>
      <p id="low" className='low'>On the way </p>
      <div className="totale">
        <div>
      <p  className="number">{otherOrders}</p>
      <p className="note">Last 7 days</p>
      </div>
      <div>
      <p  className="number">{otherOrderValue}</p>
      <p className="note">Revenue</p>
      </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default OrdersCounter;

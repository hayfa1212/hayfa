import React, { useEffect, useState } from 'react';
import supabase from '../utils/api';
import './notif.css'; // Import des styles CSS

interface Product {
  id: number;
  product_Name: string;
  quantity: number | null;
  thershold: number;
}


const ThresholdComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: products, error } = await supabase
          .from('product')
          .select('id, product_Name, quantity, thershold');
      
        if (error) {
          throw error;
        }

        if (products) {
          const filteredProducts = products.filter(product => product.quantity !== null && product.quantity < product.thershold);
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  

  const count= products.length;

  return (
    <div>
     
      <ul>
        {products.map(product => (
          <li key={product.id} className="notification error">
            <p>There is a risk of shortage for this product:{product.product_Name}</p>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThresholdComponent;

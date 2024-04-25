import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import supabase from '../utils/api';

interface ProductRatingProps {
  productId: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId }) => {
  const [rating, setRating] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const { data: { user } } = await supabase.auth.getUser(); 
      if (!user) {
        toast.error('You should login');
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("utilisateur")
        .select("role")
        .eq("email", user.email)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        toast.error("An error occurred while fetching user data");
        return;
      }

      const userRole = userData?.role;
      if (userRole !== 'admin') {
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
    };

    const savedRating = localStorage.getItem(`rating_${productId}`);
    if (savedRating !== null) {
      setRating(parseFloat(savedRating));
    }

    checkLoggedIn();
  }, [productId]);

  const handleClick = (star: number) => {
    if (!isAdmin) return;

    if (rating === star) {
      setRating(0);
      localStorage.removeItem(`rating_${productId}`);
    } else {
      setRating(star);
      localStorage.setItem(`rating_${productId}`, String(star));
    }
  };

  return (
    <div style={{ background: 'transparent' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className='star'
          style={{
            cursor: 'pointer',
            color: rating >= star ? 'gold' : 'gray',
            fontSize: `25px`,
          }}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default ProductRating;

import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext({});

const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0);

  const refresh = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCount(0);
        return;
      }
      const { data } = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCount(data.data?.items?.length || 0);
    } catch (err) {
      setCount(0);
    }
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('cart:updated', handler);
    return () => window.removeEventListener('cart:updated', handler);
  }, []);

  return (
    <CartContext.Provider value={{ count, setCount, refresh }}>{children}</CartContext.Provider>
  );
};

export { CartContext, CartProvider };

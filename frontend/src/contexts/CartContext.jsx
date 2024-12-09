import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // 添加调试信息
    return token;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + item.quantity * price;
  }, 0);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      
      // 添加更详细的 token 检查
      if (!token) {
        console.log('No token found in localStorage');
        setError('Please log in to view your cart.');
        setLoading(false);
        return;
      }

      console.log('Fetching cart with token:', token); // 添加调试信息
  
      const response = await fetch('http://localhost:5001/api/cart', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      console.log('Cart API response:', response); // 添加调试信息
  
      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token'); // 清除无效的 token
        return;
      }

      if (!response.ok) {
        throw new Error(`Error fetching cart: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Cart data received:', data); // 添加调试信息
      setCart(data.cart || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message || 'Failed to load cart data.');
    } finally {
      setLoading(false);
    }
  };

  // 在组件挂载和 token 变化时重新获取购物车数据
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCart();
    }
  }, []);

  // 监听 localStorage 变化
  useEffect(() => {
    const handleStorageChange = () => {
      const token = getToken();
      if (token) {
        fetchCart();
      } else {
        setCart([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = async (product, quantity = 1) => {
    try {
      const token = getToken();
      if (!token) {
        setError('Please log in to add items to cart.');
        return;
      }

      setError(null);
      const response = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        return;
      }

      if (!response.ok) {
        throw new Error(`Error adding to cart: ${response.status}`);
      }

      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Failed to add product to cart.');
    }
  };

  const updateCartItem = async (id, quantity) => {
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setError('Please log in to update cart items.');
        return;
      }

      setError(null);
      const response = await fetch(`http://localhost:5001/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        return;
      }

      if (!response.ok) {
        throw new Error(`Error updating cart item: ${response.status}`);
      }

      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      setError(error.message || 'Failed to update cart item.');
    }
  };

  const removeFromCart = async (id) => {
    try {
      const token = getToken();
      if (!token) {
        setError('Please log in to remove items from cart.');
        return;
      }

      setError(null);
      const response = await fetch(`http://localhost:5001/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 401) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        return;
      }

      if (!response.ok) {
        throw new Error(`Error removing item: ${response.status}`);
      }

      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      setError(error.message || 'Failed to remove cart item.');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        totalItems,
        totalPrice,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
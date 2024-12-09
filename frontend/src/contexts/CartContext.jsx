import React, { createContext, useState, useEffect, useContext } from 'react';

// 创建 Context
export const CartContext = createContext();

// API 基础 URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 从 localStorage 获取 token
  const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token); // 调试信息
    return token;
  };

  // 购物车总数量和总价格计算
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + item.quantity * price;
  }, 0);

  // 获取购物车数据
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) throw new Error('User is not authenticated.');

      console.log('Fetching cart with token:', token); // 调试信息

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token'); // 清除无效 token
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`Failed to fetch cart. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cart data received:', data); // 调试信息
      setCart(data.cart || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message || 'Failed to load cart data.');
    } finally {
      setLoading(false);
    }
  };

  // 添加到购物车
  const addToCart = async (product, quantity = 1) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Please log in to add items to cart.');

      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`Failed to add item. Status: ${response.status}`);
      }

      await fetchCart(); // 更新购物车
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Failed to add product to cart.');
    }
  };

  // 更新购物车商品数量
  const updateCartItem = async (id, quantity) => {
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    try {
      const token = getToken();
      if (!token) throw new Error('Please log in to update cart items.');

      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`Failed to update item. Status: ${response.status}`);
      }

      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      setError(error.message || 'Failed to update cart item.');
    }
  };

  // 从购物车中移除商品
  const removeFromCart = async (id) => {
    try {
      const token = getToken();
      if (!token) throw new Error('Please log in to remove items from cart.');

      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/cart/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`Failed to remove item. Status: ${response.status}`);
      }

      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
      setError(error.message || 'Failed to remove cart item.');
    }
  };

  // 在组件挂载和 token 变化时重新获取购物车数据
  useEffect(() => {
    const token = getToken();
    if (token) fetchCart();
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

// 自定义 Hook，简化 Context 使用
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
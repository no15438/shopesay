import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate total items and total price
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch cart data from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5001/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) {
        throw new Error(`Error fetching cart: ${response.status}`);
      }

      const data = await response.json();
      setCart(data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError(error.message || 'Failed to load cart data.');
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5001/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (!response.ok) {
        throw new Error(`Error adding to cart: ${response.status}`);
      }

      setCart((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Failed to add product to cart.');
    }
  };

  // Update cart item quantity
  const updateCartItem = async (id, quantity) => {
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`http://localhost:5001/api/cart/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(`Error updating cart item: ${response.status}`);
      }

      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (error) {
      console.error('Error updating cart:', error);
      setError(error.message || 'Failed to update cart item.');
    }
  };

  // Remove item from cart
  const removeFromCart = async (id) => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:5001/api/cart/remove/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error removing item: ${response.status}`);
      }

      setCart((prev) => prev.filter((item) => item.id !== id));
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
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the CartContext
export const CartContext = createContext();

// Define CartProvider to manage cart state globally
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Cart items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Load cart data from backend on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true); // Start loading
        setError(null); // Reset error
        const response = await fetch('http://localhost:5001/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!response.ok) {
          throw new Error(`Error fetching cart: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched cart data:', data); // Debug log
        // Update the cart state directly with the returned array
        setCart(data || []); // Use `data` directly as cart
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError(error.message); // Set error message
        setCart([]); // Fallback to empty cart
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCart();
  }, []);

  // Function to add a product to the cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setError(null); // Reset error
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

      const newItem = { ...product, quantity };
      setCart((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, newItem];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message);
    }
  };

  // Function to update the quantity of an item in the cart
  const updateCartItem = async (id, quantity) => {
    try {
      setError(null); // Reset error
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
      setError(error.message);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (id) => {
    try {
      setError(null); // Reset error
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
      setError(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, loading, error, addToCart, updateCartItem, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
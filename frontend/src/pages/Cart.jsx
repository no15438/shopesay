import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function Cart() {
  const { cart } = useContext(CartContext);

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="mb-4">
              <span className="font-semibold">{item.name}</span> - {item.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Cart;
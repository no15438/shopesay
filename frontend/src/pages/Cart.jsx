import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function Cart() {
  const { cart = [], updateCartQuantity, removeFromCart } = useContext(CartContext); // 添加 updateCartQuantity 和 removeFromCart 方法

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) {
      alert("Quantity must be a positive number");
      return;
    }
    updateCartQuantity(id, parseInt(newQuantity, 10));
  };

  if (cart.length === 0) {
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
            <li key={item.id} className="mb-4 flex justify-between items-center">
              <div>
                <span className="font-semibold">{item.name}</span>
                <span className="text-gray-600 ml-2">(${item.price})</span>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="border rounded p-1 w-16 text-center mr-4"
                />
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h2 className="text-xl font-bold">Total: ${calculateTotalPrice()}</h2>
        </div>
      </div>
    </div>
  );
}

export default Cart;
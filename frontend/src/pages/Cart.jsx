import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function Cart() {
  const { cart = [], updateCartItem, removeFromCart, totalItems, totalPrice } = useContext(CartContext);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1 || isNaN(newQuantity)) {
      alert('Quantity must be a positive number.');
      return;
    }
    updateCartItem(id, parseInt(newQuantity, 10));
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-4 border-b">Product</th>
              <th className="pb-4 border-b">Price</th>
              <th className="pb-4 border-b">Quantity</th>
              <th className="pb-4 border-b">Total</th>
              <th className="pb-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4">{item.name}</td>
                <td className="py-4">${item.price.toFixed(2)}</td>
                <td className="py-4">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="border rounded p-1 w-16 text-center"
                  />
                </td>
                <td className="py-4">${(item.price * item.quantity).toFixed(2)}</td>
                <td className="py-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-6 text-right">
          <p className="text-xl font-bold">Total Items: {totalItems}</p>
          <p className="text-xl font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
          <button
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            onClick={() => alert('Proceeding to checkout...')}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
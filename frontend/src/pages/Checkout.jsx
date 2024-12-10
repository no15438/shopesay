import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function Checkout() {
  const { cart } = useContext(CartContext);

  // 通过环境变量读取后端 URL
  const API_URL = process.env.REACT_APP_API_URL; 

  // 计算总金额
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // 处理确认订单逻辑
  const handleConfirmOrder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ items: cart }),
      });

      if (response.ok) {
        alert('Order placed successfully!');
      } else {
        alert('Failed to place order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred while placing the order.');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between mb-4">
              <span>{item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-bold mt-6">Total: ${total.toFixed(2)}</h2>
        <button
          onClick={handleConfirmOrder}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;
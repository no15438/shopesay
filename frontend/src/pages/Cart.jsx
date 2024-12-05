import React from 'react';

function Cart() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow p-6">
        {/* 后面会添加购物车内容 */}
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    </div>
  );
}

export default Cart;
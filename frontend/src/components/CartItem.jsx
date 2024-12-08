import React from 'react';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  if (!item) {
    return null; // 如果 item 不存在，避免渲染
  }

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      onUpdateQuantity(item.id, quantity);
    }
  };

  const handleRemoveClick = () => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      onRemove(item.id);
    }
  };

  return (
    <li className="flex justify-between items-center mb-4">
      <div>
        <h2 className="font-bold">{item.name}</h2>
        <p className="text-gray-600">{item.description}</p>
      </div>
      <div className="flex items-center">
        <input
          type="number"
          min="1"
          value={item.quantity || 1} // 确保 quantity 有默认值
          onChange={handleQuantityChange}
          className="border rounded w-16 text-center mr-4"
        />
        <span className="mr-4">${(item.price * (item.quantity || 1)).toFixed(2)}</span>
        <button
          onClick={handleRemoveClick}
          className="text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default CartItem;
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
// 修改导入路径
import { useCart } from '../contexts/CartContext';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
    <div className="flex-1">
      <h3 className="font-medium">{item.name}</h3>
      <p className="text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          disabled={item.quantity <= 1}
        >
          <Minus size={20} />
        </button>
        
        <span className="w-8 text-center">{item.quantity}</span>
        
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <button
        onClick={() => onRemove(item.id)}
        className="p-1 text-red-500 hover:bg-red-50 rounded"
      >
        <Trash2 size={20} />
      </button>
    </div>
  </div>
);

const EmptyCart = () => (
  <div className="text-center py-8 text-gray-500">
    购物车是空的
  </div>
);

const CartSummary = ({ totalItems, totalPrice }) => (
  <div className="mt-6 p-4 bg-white rounded-lg shadow">
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">商品数量:</span>
        <span className="font-medium">{totalItems} 件</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">总计:</span>
        <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const LoadingState = () => (
  <div className="max-w-2xl mx-auto p-4">
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">加载中...</span>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="max-w-2xl mx-auto p-4">
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">错误：</strong>
      <span className="block sm:inline">{message}</span>
    </div>
  </div>
);

const Cart = () => {
  const { 
    cart, 
    loading, 
    error, 
    totalItems,
    totalPrice,
    updateCartItem, 
    removeFromCart 
  } = useCart();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">购物车</h2>
        <span className="text-gray-600">{totalItems} 件商品</span>
      </div>
      
      <div className="space-y-4">
        {cart.map((item) => (
          <CartItem 
            key={item.id}
            item={item}
            onUpdateQuantity={updateCartItem}
            onRemove={removeFromCart}
          />
        ))}
      </div>
      
      {cart.length > 0 ? (
        <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};

export default Cart;
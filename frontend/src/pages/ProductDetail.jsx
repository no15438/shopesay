import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams(); // 获取产品ID
  const [product, setProduct] = useState(null); // 产品信息
  const [loading, setLoading] = useState(true); // 加载状态
  const [processingOrder, setProcessingOrder] = useState(false); // 下单状态
  const [message, setMessage] = useState(""); // 用户消息
  const [error, setError] = useState(""); // 错误信息
  const { addToCart } = useCart(); // 从 CartContext 获取 addToCart 函数
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data.product);
      } catch (error) {
        setError("Failed to load product details. Please try again.");
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      setError("Product is out of stock.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    console.log('Add to Cart clicked'); // Debugging message
    addToCart(product, 1); // 调用 CartContext 的 addToCart 方法
    setMessage("Added to cart successfully!"); // 显示成功消息
    setTimeout(() => setMessage(""), 3000); // 清除消息
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) {
      setError("Product is out of stock.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    console.log('Buy Now clicked'); // Debugging message
    setProcessingOrder(true); // 显示下单状态
    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          shippingAddress: "123 Main St, Example City",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const order = await response.json();
      navigate(`/order/${order.id}`); // 跳转到订单详情页
    } catch (error) {
      setError("Failed to place the order. Please try again.");
      console.error('Error placing order:', error);
      setTimeout(() => setError(""), 3000); // 清除错误消息
    } finally {
      setProcessingOrder(false); // 恢复下单状态
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row">
        <img
          src={`http://localhost:5001/images/${product.image_url}`}
          alt={product.name}
          className="w-full md:w-1/2 rounded"
          onError={(e) => (e.target.src = "/default-image.png")} // 替换为默认图片
        />
        <div className="md:ml-6">
          <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-xl font-semibold text-blue-600 mb-4">${product.price}</p>
          <p className={`text-lg mb-6 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </p>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
              disabled={processingOrder || product.stock <= 0}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500"
              disabled={processingOrder || product.stock <= 0}
            >
              {processingOrder ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
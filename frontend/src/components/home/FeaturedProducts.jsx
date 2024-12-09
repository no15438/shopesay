import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]); // 商品数据
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001'; // 后端 API 地址

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/featured`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-blue-500 font-semibold">Loading featured products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center font-semibold">
        <p>Error: {error}</p>
        <p>Please try refreshing the page or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`} // 跳转到商品详情页面
          className="block border p-4 rounded shadow hover:shadow-lg transition"
        >
          <img
            src={product.image_url || '/assets/images/placeholder.png'}
            alt={product.name}
            className="w-full h-40 object-cover mb-4 rounded"
          />
          <h3 className="text-lg font-bold mb-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          <p className="text-gray-800 font-bold text-lg">${product.price}</p>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedProducts;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function CategoryProducts() {
  const { id } = useParams(); // 获取分类 ID
  const [products, setProducts] = useState([]); // 存储产品列表
  const [categoryName, setCategoryName] = useState(''); // 存储分类名称
  const [loading, setLoading] = useState(true); // 控制加载状态
  const [error, setError] = useState(null); // 存储错误信息
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        console.log('Fetching products for category ID:', id);

        const response = await fetch(`${API_URL}/api/products/category/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data = await response.json();

        // 验证响应格式
        if (!data.categoryName || !Array.isArray(data.products)) {
          throw new Error('Invalid response format: categoryName or products missing');
        }

        // 更新状态
        setCategoryName(data.categoryName);
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError(err.message || 'An error occurred while fetching products.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-blue-500 font-semibold">Loading products...</p>
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

  if (!products || products.length === 0) {
    return (
      <div className="text-gray-600 text-center font-semibold">
        <p>No products found for the category "{categoryName}".</p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 显示分类名称 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{categoryName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={product.image_url || '/assets/images/placeholder.png'}
                alt={product.name}
                className="w-full h-40 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-bold mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>
              <p className="text-gray-800 font-bold text-lg mb-4">${product.price}</p>
              <Link
                to={`/product/${product.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryProducts;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories || []);
        } else {
          console.error('Failed to fetch categories:', data.message);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Shop by Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`} // 跳转到分类详情页
              className="block bg-gray-100 rounded-lg shadow hover:shadow-lg transition-transform transform hover:scale-105 p-4"
            >
              <img
                src={`${API_URL}/${category.image_url}`} // 确保后端返回 `image_url`
                alt={category.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
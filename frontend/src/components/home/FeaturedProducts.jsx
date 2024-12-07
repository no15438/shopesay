import React, { useState, useEffect } from 'react';

function FeaturedProducts() {
  const [products, setProducts] = useState([]); // State to store products data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(''); // State to handle errors

  // UseEffect hook to fetch data when component mounts
  useEffect(() => {
    // Fetch products from backend API
    fetch('/api/products') // Assume backend endpoint /api/products returns the featured products
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json(); // Convert response to JSON
      })
      .then((data) => {
        setProducts(data); // Set the fetched products to state
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        setError(err.message); // Set error if any occurs during fetch
        setLoading(false); // Set loading to false when error happens
      });
  }, []); // Empty dependency array to run the effect once when component mounts

  // Show loading message if data is still being fetched
  if (loading) {
    return <p>Loading products...</p>;
  }

  // Show error message if there is an error during fetch
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <p>No featured products available</p> // Show message if no products are available
      ) : (
        // Iterate over products array and display each product
        products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3> {/* Display product name */}
              <p className="text-gray-600 mb-4">{product.description}</p> {/* Display product description */}
              <p className="text-gray-900 font-semibold mb-4">${product.price}</p> {/* Display product price */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Learn More
              </button> {/* Button to learn more about the product */}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FeaturedProducts;
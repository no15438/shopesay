import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Calculate cart item count
  const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center">
        {/* Website Title */}
        <Link to="/" className="text-2xl font-bold text-gray-900">
          ShopEasy
        </Link>

        {/* Search Bar */}
        <form className="flex space-x-4 items-center" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Navigation Menu and Links */}
        <div className="flex space-x-4 items-center">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/products" className="nav-link">
            Products
          </Link>
          <Link to="/categories" className="nav-link">
            Categories
          </Link>
          <Link to="/cart" className="nav-link">
            Cart{' '}
            {cartItemCount > 0 && (
              <span
                className="text-sm text-white bg-red-500 rounded-full px-2"
                title={`${cartItemCount} items in cart`}
              >
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <span className="text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={logout}
                className="nav-link bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
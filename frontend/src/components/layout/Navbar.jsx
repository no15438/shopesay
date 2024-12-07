import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart(); // Retrieve cart data dynamically
  const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center">
        {/* Website Title */}
        <Link to="/" className="text-2xl font-bold text-gray-900">
          ShopEasy
        </Link>

        {/* Search Bar */}
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            placeholder="Search for products..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Search
          </button>
        </div>

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
            Cart {cartItemCount > 0 && <span className="text-sm text-white bg-red-500 rounded-full px-2">{cartItemCount}</span>}
          </Link>
          {user ? (
            <>
              <span className="text-gray-600">Welcome, {user.email}</span>
              <button 
                onClick={logout} 
                className="nav-link"
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
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-900">
          Bookstore
        </Link>
        <div className="flex space-x-4 items-center">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/books" className="nav-link">
            Books
          </Link>
          <Link to="/cart" className="nav-link">
            Cart
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
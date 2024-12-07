import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by checking for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/products'); // Navigate to products page if logged in
    } else {
      navigate('/login'); // Navigate to login page if not logged in
    }
  };

  return (
    <div
      className="rounded-lg shadow-lg p-6 mb-6"
      style={{
        backgroundColor: '#1a202c', // Dark gray background
        color: '#f7fafc', // Light gray text
      }}
    >
      <h2 className="text-4xl font-extrabold mb-4">Welcome to ShopEasy</h2>
      <p className="text-lg mb-6">Discover exclusive deals and a wide range of products for every need.</p>

      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        {isLoggedIn ? 'Browse Products' : 'Login to Browse Products'}
      </button>
    </div>
  );
}

export default HeroSection;
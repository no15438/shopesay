import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`); // Navigate to search results page
    }
  };

  return (
    <div 
      className="bg-cover bg-center rounded-lg shadow-lg p-6 mb-6" 
      style={{
        backgroundImage: 'url(/path/to/your/image.jpg)' // Set your background image here
      }}
    >
      <h2 className="text-3xl font-bold text-white mb-4">Welcome to our Shopping Website</h2>
      <p className="text-white mb-4">Discover a wide range of products for every need.</p>

      <form onSubmit={handleSearchSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Search for products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 w-full"
        >
          Search
        </button>
      </form>

      <button
        onClick={handleButtonClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isLoggedIn ? 'Browse Products' : 'Login to Browse Products'}
      </button>
    </div>
  );
}

export default HeroSection;
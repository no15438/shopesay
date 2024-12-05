import React from 'react';

function HeroSection() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to our Bookstore</h2>
      <p className="text-gray-600 mb-4">Discover our vast collection of books for all readers.</p>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Browse Books
      </button>
    </div>
  );
}

export default HeroSection;
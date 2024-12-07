import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';

// Home Page Component
function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
}

export default Home;
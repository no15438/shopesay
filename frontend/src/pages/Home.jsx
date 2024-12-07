import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Testimonials from '../components/home/Testimonials';
import PromoBanner from '../components/home/PromoBanner';

// Home Page Component
function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Promotion Banner */}
      <PromoBanner />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Customer Testimonials */}
      <Testimonials />
    </div>
  );
}

export default Home;
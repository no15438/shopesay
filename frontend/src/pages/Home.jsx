import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Testimonials from '../components/home/Testimonials';
import PromoBanner from '../components/home/PromoBanner';
import CategoriesSection from '../components/home/CategoriesSection';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Promotion Banner */}
      <PromoBanner />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products Section */}
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Products</h2>
          <p className="text-gray-600 mb-8">
            Explore our collection of best-selling and trending products. Don't miss out!
          </p>
          <FeaturedProducts />
        </div>
      </section>

      {/* Customer Testimonials */}
      <Testimonials />
    </div>
  );
}

export default Home;
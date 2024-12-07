import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; // 确保导入 CartProvider
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* 将 CartProvider 添加到树中 */}
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="bg-white shadow-md">
              <Navbar />
            </header>
            <main className="flex-grow">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
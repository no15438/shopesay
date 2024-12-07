import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; // Ensure CartProvider is imported
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register'; // Import Register page
import ResetPassword from './pages/ResetPassword'; // Import Reset Password page
import Dashboard from './pages/Dashboard'; // Import Dashboard page

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Wrap the app with CartProvider */}
        <Router>
          <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header section with Navbar */}
            <header className="bg-white shadow-md">
              <Navbar />
            </header>

            {/* Main content area */}
            <main className="flex-grow">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Routes>
                  {/* Define app routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} /> {/* Add register route */}
                  <Route path="/reset-password" element={<ResetPassword />} /> {/* Add reset password route */}
                  <Route path="/dashboard" element={<Dashboard />} /> {/* Add dashboard route */}
                </Routes>
              </div>
            </main>

            {/* Footer section */}
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
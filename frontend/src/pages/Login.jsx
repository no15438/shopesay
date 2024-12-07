import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Attempt login
      await login(email, password);
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card">
        <h2 className="heading-2 text-center">Login</h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Forgot your password?{' '}
            <a
              href="/reset-password"
              className="text-blue-600 hover:underline"
            >
              Reset here
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
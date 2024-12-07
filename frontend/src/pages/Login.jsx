import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  // State for username and password inputs
  const [username, setUsername] = useState(''); // Username input state
  const [password, setPassword] = useState(''); // Password input state
  const [error, setError] = useState(''); // Error message state
  const { login, loading } = useAuth(); // Access login function and loading state from AuthContext
  const navigate = useNavigate(); // React Router's navigation function

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (loading) return; // Prevent multiple form submissions while loading
    setError(''); // Reset error message
    console.log('Login attempt with:', { username, password }); // Debugging log

    try {
      // Call the login function from AuthContext
      await login(username, password);
      console.log('Login successful! Redirecting to dashboard.'); // Debugging log
      navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (err) {
      console.error('Login error:', err); // Debugging log for errors
      // Set the error message for display
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card">
        <h2 className="heading-2 text-center">Login</h2>
        {/* Display error message if one exists */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}
        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username input field */}
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
              required
              placeholder="Enter your username"
            />
          </div>
          {/* Password input field */}
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              required
              placeholder="Enter your password"
            />
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Disabled styling while loading
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {/* Links for password reset and registration */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Forgot your password?{' '}
            <Link to="/reset-password" className="text-blue-600 hover:underline">
              Reset here
            </Link>
          </p>
          <p className="text-gray-600 mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
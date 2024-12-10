import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate 钩子

function Dashboard() {
  const { user, logout } = useAuth(); // 从 AuthContext 中获取用户信息和登出方法
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate(); // 初始化导航

  const API_URL = process.env.REACT_APP_API_URL; 

  useEffect(() => {
    if (!user) {
      // 如果用户未登录，重定向到主界面
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const response = await fetch(`${API_URL}/api/admin/dashboard`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setStats(data.stats);
            setRecentOrders(data.recentOrders);
          } else {
            console.error('Failed to fetch dashboard data:', data.message);
          }
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
        }
      };

      const fetchCartData = async () => {
        try {
          const response = await fetch(`${API_URL}/api/cart`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setCartItems(data.cartItems || []);
          } else {
            console.error('Failed to fetch cart data:', data.message);
          }
        } catch (err) {
          console.error('Error fetching cart data:', err);
        }
      };

      fetchDashboardData();
      fetchCartData();
    }
  }, [user]);

  const handleLogout = () => {
    logout(); // 调用上下文中的 logout 方法
    navigate('/'); // 登出后重定向到主界面
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-lg">Welcome, {user?.username || 'User'}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Orders</h2>
          <p className="text-2xl">{stats.orders || 0}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Products</h2>
          <p className="text-2xl">{stats.products || 0}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold">Total Users</h2>
          <p className="text-2xl">{stats.users || 0}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {recentOrders.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.customerName}</td>
                  <td className="border px-4 py-2">${order.total}</td>
                  <td className="border px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent orders found.</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {cartItems.length > 0 ? (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b py-2">
                <span>{item.name}</span>
                <span>${item.price} x {item.quantity}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your shopping cart is empty.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
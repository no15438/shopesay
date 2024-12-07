const db = require('../config/db');

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const [customers] = await db.execute('SELECT id, username, email, created_at FROM users WHERE is_admin = 0');
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Failed to fetch customers' });
    }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
    try {
        const [orders] = await db.execute(`
            SELECT COUNT(*) AS total_orders, 
                   SUM(total_amount) AS total_sales 
            FROM orders
        `);
        res.status(200).json({
            totalOrders: orders[0].total_orders,
            totalSales: orders[0].total_sales
        });
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({ message: 'Failed to generate sales report' });
    }
};

// Get monthly sales data
exports.getMonthlySales = async (req, res) => {
    try {
        const [salesData] = await db.execute(`
            SELECT MONTH(created_at) AS month, 
                   SUM(total_amount) AS monthly_sales 
            FROM orders 
            GROUP BY MONTH(created_at)
        `);
        res.status(200).json(salesData);
    } catch (error) {
        console.error('Error fetching monthly sales data:', error);
        res.status(500).json({ message: 'Failed to fetch monthly sales data' });
    }
};
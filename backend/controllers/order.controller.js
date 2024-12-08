const db = require('../config/db');

// Fetch all orders for the logged-in user with pagination and sorting
exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, sort = 'created_at', order = 'DESC' } = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        const [orders] = await db.execute(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
            [userId, limitNum, offset]
        );

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// Fetch a single order by ID for the logged-in user
exports.getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid order ID' });
        }

        const [orders] = await db.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]);

        if (!orders[0]) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(orders[0]);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ message: 'Failed to fetch order' });
    }
};

// Create a new order for the logged-in user
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity, shippingAddress } = req.body;

        // Input validation
        if (!userId || !productId || typeof quantity !== 'number' || quantity <= 0 || !shippingAddress || shippingAddress.length < 5 || shippingAddress.length > 255) {
            return res.status(400).json({ message: 'Invalid input: ensure all fields are valid' });
        }

        // Fetch product price from the database
        const [productResult] = await db.execute('SELECT price FROM products WHERE id = ?', [productId]);
        if (productResult.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productPrice = productResult[0].price;
        const totalAmount = productPrice * quantity;

        console.log('Creating order with:', { userId, productId, quantity, totalAmount, shippingAddress });

        // Insert order into the database
        const [orderResult] = await db.execute(
            'INSERT INTO orders (user_id, product_id, quantity, total_amount, status, shipping_address) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, productId, quantity, totalAmount, 'pending', shippingAddress]
        );

        res.status(201).json({ message: 'Order created successfully', orderId: orderResult.insertId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
};

// Update the status of an order
exports.updateOrderStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'shipped', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status: valid statuses are ${validStatuses.join(', ')}` });
        }

        const [result] = await db.execute(
            'UPDATE orders SET status = ? WHERE id = ? AND user_id = ?',
            [status, id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ message: 'You are not authorized to update this order' });
        }

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
};
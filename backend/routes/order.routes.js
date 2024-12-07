const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Get all orders for the logged-in user with pagination
router.get('/', verifyToken, orderController.getOrders);

// Get a specific order by ID for the logged-in user
router.get('/:id', verifyToken, orderController.getOrderById);

// Create a new order for the logged-in user
router.post('/', verifyToken, orderController.createOrder);

// Update the status of an order
router.put('/:id', verifyToken, orderController.updateOrderStatus);

module.exports = router;
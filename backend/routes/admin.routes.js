const router = require('express').Router();
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');
const adminController = require('../controllers/admin.controller');

// Get all customers
router.get('/customers', verifyToken, verifyAdmin, adminController.getAllCustomers);

// Get sales report
router.get('/sales-report', verifyToken, verifyAdmin, adminController.getSalesReport);

// Get monthly sales data
router.get('/monthly-sales', verifyToken, verifyAdmin, adminController.getMonthlySales);

module.exports = router;
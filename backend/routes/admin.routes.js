const router = require('express').Router();
const { verifyAdmin } = require('../middlewares/auth.middleware');
const adminController = require('../controllers/admin.controller');

// Get all customers
router.get('/customers', verifyAdmin, adminController.getAllCustomers);

// Get sales report
router.get('/sales-report', verifyAdmin, adminController.getSalesReport);

// Get monthly sales data
router.get('/monthly-sales', verifyAdmin, adminController.getMonthlySales);

module.exports = router;
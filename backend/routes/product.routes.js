const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const productController = require('../controllers/product.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Common validation rules for products
const productValidationRules = [
    body('name').optional().notEmpty().withMessage('Name must not be empty').trim(),
    body('price').optional().isNumeric().withMessage('Price must be a valid number'),
    body('description').optional().trim(),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('category_id').optional().isInt().withMessage('Category ID must be an integer')
];

// Routes

// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:id', productController.getProductById);

// Get products by category
router.get('/category/:categoryId', productController.getProductsByCategory);

// Get product reviews
router.get('/:productId/reviews', productController.getProductReviews);

// Create a new product (Admin only)
router.post(
    '/',
    verifyToken,
    verifyAdmin,
    [
        body('name').notEmpty().withMessage('Name is required').trim(),
        body('price').isNumeric().withMessage('Price must be a number'),
        body('description').optional().trim(),
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('category_id').isInt().withMessage('Category ID must be an integer')
    ],
    handleValidationErrors,
    productController.createProduct
);

// Update a product (Admin only)
router.put(
    '/:id',
    verifyToken,
    verifyAdmin,
    productValidationRules,
    handleValidationErrors,
    productController.updateProduct
);

// Delete a product (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, productController.deleteProduct);

// Add product review (Authenticated users)
router.post(
    '/:productId/reviews',
    verifyToken,
    [
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('reviewText').optional().trim()
    ],
    handleValidationErrors,
    productController.addProductReview
);

// Get product inventory (Admin only)
router.get('/:productId/inventory', verifyToken, verifyAdmin, productController.getProductInventory);

// Update product inventory (Admin only)
router.put(
    '/:productId/inventory',
    verifyToken,
    verifyAdmin,
    [
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
    ],
    handleValidationErrors,
    productController.updateProductInventory
);

module.exports = router;
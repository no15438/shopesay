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

// Log route usage for debugging
router.use((req, res, next) => {
    console.log(`Product route hit: ${req.method} ${req.originalUrl}`);
    next();
});

// Routes

// Featured products route
router.get('/featured', (req, res) => {
    console.log('GET /featured route hit');
    productController.getFeaturedProducts(req, res);
});

// Get all products
router.get('/', (req, res) => {
    console.log('GET /api/products route hit');
    productController.getAllProducts(req, res);
});

// Get a product by ID
router.get('/:id', (req, res) => {
    console.log(`GET /api/products/${req.params.id} route hit`);
    productController.getProductById(req, res);
});

// Get products by category
router.get('/category/:categoryId', (req, res) => {
    console.log(`GET /api/products/category/${req.params.categoryId} route hit`);
    productController.getProductsByCategory(req, res);
});

// Get product reviews
router.get('/:productId/reviews', (req, res) => {
    console.log(`GET /api/products/${req.params.productId}/reviews route hit`);
    productController.getProductReviews(req, res);
});

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
    (req, res) => {
        console.log('POST /api/products route hit');
        productController.createProduct(req, res);
    }
);

// Update a product (Admin only)
router.put(
    '/:id',
    verifyToken,
    verifyAdmin,
    [
        body('name').optional().notEmpty().withMessage('Name must not be empty').trim(),
        body('price').optional().isNumeric().withMessage('Price must be a valid number'),
        body('description').optional().trim(),
        body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
        body('category_id').optional().isInt().withMessage('Category ID must be an integer')
    ],
    handleValidationErrors,
    (req, res) => {
        console.log(`PUT /api/products/${req.params.id} route hit`);
        productController.updateProduct(req, res);
    }
);

// Delete a product (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, (req, res) => {
    console.log(`DELETE /api/products/${req.params.id} route hit`);
    productController.deleteProduct(req, res);
});

// Add product review (Authenticated users)
router.post(
    '/:productId/reviews',
    verifyToken,
    [
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('reviewText').optional().trim()
    ],
    handleValidationErrors,
    (req, res) => {
        console.log(`POST /api/products/${req.params.productId}/reviews route hit`);
        productController.addProductReview(req, res);
    }
);

// Get product inventory (Admin only)
router.get('/:productId/inventory', verifyToken, verifyAdmin, (req, res) => {
    console.log(`GET /api/products/${req.params.productId}/inventory route hit`);
    productController.getProductInventory(req, res);
});

// Update product inventory (Admin only)
router.put(
    '/:productId/inventory',
    verifyToken,
    verifyAdmin,
    [
        body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
    ],
    handleValidationErrors,
    (req, res) => {
        console.log(`PUT /api/products/${req.params.productId}/inventory route hit`);
        productController.updateProductInventory(req, res);
    }
);

module.exports = router;
const router = require('express').Router();
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:categoryId', productController.getProductsByCategory);

router.post('/', verifyToken, [
    body('name').notEmpty().trim(),
    body('price').isNumeric(),
    body('description').trim(),
    body('stock').isInt({ min: 0 }),
    body('category_id').isInt()
], productController.createProduct);

router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
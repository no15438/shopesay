const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware'); // 验证用户是否已登录
const {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cart.controller'); // 引入购物车控制器
const { check, validationResult } = require('express-validator'); // 添加输入验证工具

const router = express.Router();

// 错误处理中间件
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 获取购物车内容
router.get('/', verifyToken, async (req, res) => {
  try {
    await getCart(req, res);
  } catch (err) {
    console.error('Error fetching cart:', err);
    res.status(500).json({ message: 'Failed to fetch cart data.' });
  }
});

// 添加商品到购物车
router.post(
  '/',
  [
    verifyToken,
    check('productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer.'),
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      await addToCart(req, res);
    } catch (err) {
      console.error('Error adding to cart:', err);
      res.status(500).json({ message: 'Failed to add item to cart.' });
    }
  }
);

// 更新购物车商品数量
router.put(
  '/:id',
  [
    verifyToken,
    check('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer.'),
    check('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      await updateCartItem(req, res);
    } catch (err) {
      console.error('Error updating cart item:', err);
      res.status(500).json({ message: 'Failed to update cart item.' });
    }
  }
);

// 从购物车删除商品
router.delete(
  '/:id',
  [
    verifyToken,
    check('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer.'),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      await deleteCartItem(req, res);
    } catch (err) {
      console.error('Error deleting cart item:', err);
      res.status(500).json({ message: 'Failed to delete cart item.' });
    }
  }
);

module.exports = router;
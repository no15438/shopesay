const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware'); // 验证用户是否已登录
const {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} = require('../controllers/cart.controller'); // 引入购物车控制器

const router = express.Router();

// 获取购物车内容
router.get('/', verifyToken, getCart);

// 添加商品到购物车
router.post('/', verifyToken, addToCart);

// 更新购物车商品数量
router.put('/:id', verifyToken, updateCartItem);

// 从购物车删除商品
router.delete('/:id', verifyToken, deleteCartItem);

module.exports = router;
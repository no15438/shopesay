const express = require('express');
const { verifyToken } = require('../middlewares/auth.middleware');
const {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem
} = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', verifyToken, getCart); // 获取购物车内容
router.post('/', verifyToken, addToCart); // 添加商品到购物车
router.put('/:id', verifyToken, updateCartItem); // 更新购物车中商品数量
router.delete('/:id', verifyToken, deleteCartItem); // 从购物车删除商品

module.exports = router;
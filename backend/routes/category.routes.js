const express = require('express');
const router = express.Router();
const db = require('../config/db'); // 确保数据库配置正确

// GET /api/categories - Fetch all categories
router.get('/', async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories'); // 确保 SQL 查询正确
        res.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
});

// GET /api/categories/:id - Fetch category by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params; // 从 URL 获取分类 ID
        const [category] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]); // SQL 查询分类
        if (category.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ category: category[0] }); // 返回单个分类信息
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Error fetching category by ID' });
    }
});

module.exports = router;
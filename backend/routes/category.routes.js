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

module.exports = router;
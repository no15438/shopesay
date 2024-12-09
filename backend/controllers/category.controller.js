const db = require('../config/db');

// Fetch all categories
exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories');
        res.json({ categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

// Fetch a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const [category] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
        if (category.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ category: category[0] });
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Error fetching category by ID' });
    }
};

// Fetch all products in a category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const [products] = await db.execute('SELECT * FROM products WHERE category_id = ?', [id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category.' });
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products for category:', error);
        res.status(500).json({ message: 'Error fetching products for category.' });
    }
};
const { validationResult } = require('express-validator');
const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `);
        
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT * FROM products 
            WHERE category_id = ?
            ORDER BY created_at DESC
        `, [req.params.categoryId]);

        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description, price, stock, category_id, image_url } = req.body;

        const [result] = await db.execute(`
            INSERT INTO products (name, description, price, stock, category_id, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, description, price, stock, category_id, image_url]);

        res.status(201).json({
            message: 'Product created successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const { name, description, price, stock, category_id, image_url } = req.body;
        const productId = req.params.id;

        const [result] = await db.execute(`
            UPDATE products 
            SET name = ?, description = ?, price = ?, 
                stock = ?, category_id = ?, image_url = ?
            WHERE id = ?
        `, [name, description, price, stock, category_id, image_url, productId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};
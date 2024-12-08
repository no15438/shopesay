const { validationResult } = require('express-validator');
const db = require('../config/db');

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name AS category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name AS category_name 
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
        res.status(500).json({ message: 'Failed to fetch product' });
    }
};

// Get products by category
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
        res.status(500).json({ message: 'Failed to fetch products by category' });
    }
};

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
    try {
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
        res.status(500).json({ message: 'Failed to create product' });
    }
};

// Update a product (Admin only)
exports.updateProduct = async (req, res) => {
    try {
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
        res.status(500).json({ message: 'Failed to update product' });
    }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

// Add product review
exports.addProductReview = async (req, res) => {
    const { productId, rating, reviewText } = req.body;
    const userId = req.user.id;  // Get user ID from JWT

    try {
        const [existingReview] = await db.execute(
            'SELECT * FROM product_reviews WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existingReview.length > 0) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        // Add the new product review
        await db.execute(
            'INSERT INTO product_reviews (user_id, product_id, rating, review_text) VALUES (?, ?, ?, ?)',
            [userId, productId, rating, reviewText]
        );

        res.status(201).json({ message: 'Review added successfully.' });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review' });
    }
};

// Get product reviews
exports.getProductReviews = async (req, res) => {
    const productId = req.params.productId;

    try {
        const [reviews] = await db.execute(
            'SELECT users.username, product_reviews.rating, product_reviews.review_text, product_reviews.created_at FROM product_reviews JOIN users ON product_reviews.user_id = users.id WHERE product_reviews.product_id = ?',
            [productId]
        );

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews' });
    }
};

// Get product inventory
exports.getProductInventory = async (req, res) => {
    const productId = req.params.productId;

    try {
        const [product] = await db.execute('SELECT stock FROM products WHERE id = ?', [productId]);

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ stock: product[0].stock });
    } catch (error) {
        console.error('Error fetching product inventory:', error);
        res.status(500).json({ message: 'Error fetching product inventory' });
    }
};

// Update product inventory (Admin only)
exports.updateProductInventory = async (req, res) => {
    const productId = req.params.productId;
    const { stock } = req.body;

    try {
        await db.execute('UPDATE products SET stock = ? WHERE id = ?', [stock, productId]);

        res.status(200).json({ message: 'Product inventory updated successfully' });
    } catch (error) {
        console.error('Error updating product inventory:', error);
        res.status(500).json({ message: 'Error updating product inventory' });
    }
};

exports.getFeaturedProducts = async (req, res) => {
    console.log('Fetching featured products...');
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE is_featured = 1');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ message: 'Failed to fetch featured products' });
    }
};
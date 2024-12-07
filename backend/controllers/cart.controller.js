const db = require('../config/db');

// 获取购物车内容
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const [cartItems] = await db.execute(`
            SELECT ci.id, ci.quantity, p.name, p.price, p.image_url, p.stock
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `, [userId]);

        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
};

// 添加商品到购物车
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // 检查商品是否存在库存
        const [products] = await db.execute('SELECT stock FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (products[0].stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // 插入或更新购物车
        await db.execute(`
            INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + ?
        `, [userId, productId, quantity, quantity]);

        res.json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
};

// 更新购物车中商品数量
exports.updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        await db.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, id]);

        res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Failed to update cart item' });
    }
};

// 从购物车删除商品
exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;

        await db.execute('DELETE FROM cart_items WHERE id = ?', [id]);

        res.json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Failed to delete cart item' });
    }
};
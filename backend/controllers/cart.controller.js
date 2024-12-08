const db = require('../config/db'); // 连接数据库

// 获取当前用户的购物车内容
exports.getCart = async (req, res) => {
  const userId = req.user.id; // 从请求中获取当前用户ID
  try {
    const [rows] = await db.execute(
      'SELECT p.id, p.name, p.price, ci.quantity FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.user_id = ?',
      [userId]
    );
    res.json({ cart: rows });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

// 将商品添加到购物车
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id; // 当前用户的ID
  try {
    // 检查该商品是否已经在购物车中
    const [existingItem] = await db.execute(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existingItem.length > 0) {
      // 如果商品已经存在，更新数量
      await db.execute(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      // 否则，插入新的商品
      await db.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

// 更新购物车中的商品数量
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params; // 商品的ID
  const userId = req.user.id;

  try {
    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, id]
    );
    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

// 从购物车中移除商品
exports.deleteCartItem = async (req, res) => {
  const { id } = req.params; // 商品的ID
  const userId = req.user.id;

  try {
    await db.execute('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [userId, id]);
    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};
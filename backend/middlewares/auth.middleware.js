const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 检查 Authorization 头是否存在并以 Bearer 开头
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[DEBUG] Missing or malformed Authorization header:', authHeader);
            return res.status(401).json({ message: 'No token provided or invalid format' });
        }

        const token = authHeader.split(' ')[1];

        // 验证令牌
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { maxAge: '1h' });
        console.log('[DEBUG] Token decoded successfully:', decoded);

        // 查询用户信息
        const [users] = await db.execute(
            'SELECT id, username, is_admin, is_active FROM users WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            console.log('[DEBUG] User not found for ID:', decoded.id);
            return res.status(401).json({ message: 'User not found' });
        }

        if (!users[0].is_active) {
            console.log('[DEBUG] User is inactive for ID:', decoded.id);
            return res.status(401).json({ message: 'User is inactive' });
        }

        // 将用户信息存入请求对象
        req.user = users[0];
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('[DEBUG] Token expired:', error.message);
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            console.error('[DEBUG] Invalid token:', error.message);
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.error('[DEBUG] Internal server error:', error.message);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        console.log('[DEBUG] No user information found in request');
        return res.status(403).json({ message: 'No user information found. Please log in.' });
    }

    if (!req.user.is_admin) {
        console.log('[DEBUG] User is not an admin:', req.user.id);
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    console.log('[DEBUG] Admin access granted for user ID:', req.user.id);
    next();
};

module.exports = { verifyToken, verifyAdmin };
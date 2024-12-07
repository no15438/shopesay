const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided or invalid format' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { maxAge: '1h' }); 

        const [users] = await db.execute(
            'SELECT id, username, is_admin, is_active FROM users WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0 || !users[0].is_active) {
            return res.status(401).json({ message: 'Invalid or inactive user' });
        }

        req.user = users[0]; 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ message: 'No user information found. Please log in.' });
    }

    if (!req.user.is_admin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next();
};

module.exports = { verifyToken, verifyAdmin };
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const [users] = await db.execute(
            'SELECT id, username, email, is_admin FROM users WHERE id = ?',
            [decoded.id]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: 'Invalid token'
            });
        }

        req.user = users[0];
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

module.exports = { verifyToken };
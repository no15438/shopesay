const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/db');

// Register a new user
exports.register = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check for existing user
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (users.length > 0) {
            return res.status(400).json({
                message: `The username '${username}' or email '${email}' is already in use.`
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Generate a token
        const token = jwt.sign(
            { id: result.insertId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        console.error('Register error:', error.message || error);
        res.status(500).json({
            message: 'An internal error occurred during registration'
        });
    }
};

// Log in an existing user
exports.login = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Check if user exists
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user.id, isAdmin: user.is_admin }, // Include user role in token
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error('Login error:', error.message || error);
        res.status(500).json({
            message: 'An internal error occurred during login'
        });
    }
};

// Update user information (address or password)
exports.updateUser = async (req, res) => {
    const { address, password } = req.body;
    const userId = req.user.id; // Ensure user is authenticated and user ID is available

    try {
        // Update password if provided
        if (password) {
            // Validate password strength
            if (password.length < 8 || !/\d/.test(password)) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long and contain a number' });
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);
        }

        // Update address if provided
        if (address) {
            await db.execute('UPDATE users SET address = ? WHERE id = ?', [address, userId]);
        }

        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Failed to update user information' });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { id: user[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token valid for 1 hour
        );

        // TODO: Implement email sending logic here
        console.log(`Reset token (send this via email): ${resetToken}`);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error.message || error);
        res.status(500).json({ message: 'An internal error occurred during password reset request' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error.message || error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const jwt = require('jsonwebtoken'); // For generating and verifying JWT tokens
const { validationResult } = require('express-validator'); // For validating request data
const db = require('../config/db'); // Database configuration and connection
const nodemailer = require('nodemailer'); // For sending emails

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Register a new user
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check if username or email already exists
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (users.length > 0) {
            return res.status(400).json({
                message: `The username '${username}' or email '${email}' is already in use.`,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Generate a JWT token for the new user
        const token = jwt.sign(
            { id: result.insertId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                username,
                email,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'An internal error occurred during registration' });
    }
};

// Log in an existing user
exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Query user by username
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

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, isAdmin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRY || '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.is_admin,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An internal error occurred during login' });
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        // Generate a reset token
        const resetToken = jwt.sign(
            { id: user[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the reset token via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Here is your password reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'An internal error occurred during password reset request' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify reset token
        const userId = decoded.id;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};

// Update user information
exports.updateUser = async (req, res) => {
    const { address, password } = req.body;
    const userId = req.user.id; // Retrieve user ID from the authenticated request

    try {
        if (password) {
            if (password.length < 8 || !/\d/.test(password)) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters long and contain a number',
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, userId]);
        }

        if (address) {
            await db.execute('UPDATE users SET address = ? WHERE id = ?', [address, userId]);
        }

        res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Failed to update user information' });
    }
};
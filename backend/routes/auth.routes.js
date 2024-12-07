const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validateRequest = require('../middlewares/validateRequest');
const { verifyToken } = require('../middlewares/auth.middleware');

// Register route
router.post('/register', [
    body('username').isLength({ min: 3 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must only contain letters, numbers, and underscores'),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }).matches(/\d/).withMessage('Password must contain at least one number')
], validateRequest, authController.register);

// Login route
router.post('/login', [
    body('username').trim(),
    body('password').exists()
], validateRequest, authController.login);

// Update user route
router.put('/update', [
    body('address').optional().trim(),
    body('password').optional().isLength({ min: 6 }).matches(/\d/).withMessage('Password must contain at least one number')
], verifyToken, validateRequest, authController.updateUser);

// Forgot password route
router.post('/forgot-password', [
    body('email').isEmail().withMessage('A valid email is required')
], validateRequest, authController.forgotPassword);

// Reset password route
router.post('/reset-password', [
    body('token').exists().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).matches(/\d/).withMessage('Password must contain at least one number')
], validateRequest, authController.resetPassword);

module.exports = router;
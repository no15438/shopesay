const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

router.post('/register', [
    body('username').isLength({ min: 3 }).trim(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
], authController.register);

router.post('/login', [
    body('username').trim(),
    body('password').exists()
], authController.login);

module.exports = router;
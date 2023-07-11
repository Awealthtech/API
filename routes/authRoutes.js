const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');

// Register a new user
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Reset password
router.post('/reset-password', authController.resetPassword);

module.exports = router;

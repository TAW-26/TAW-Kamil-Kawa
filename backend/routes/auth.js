const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Rejestracja nowego użytkownika
router.post('/register', authController.register);

// POST /api/auth/login - Logowanie użytkownika
router.post('/login', authController.login);

module.exports = router;

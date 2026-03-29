const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// GET /api/categories - Lista kategorii (publiczny)
router.get('/', categoryController.getAll);

// POST /api/categories - Dodanie kategorii (tylko admin)
router.post('/', authenticate, authorizeAdmin, categoryController.create);

module.exports = router;

const express = require('express');
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', categoryController.getAll);
router.post('/', authenticate, authorizeAdmin, categoryController.create);

module.exports = router;

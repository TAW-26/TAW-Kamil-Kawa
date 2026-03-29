const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// GET /api/facilities - Lista aktywnych obiektów (publiczny)
router.get('/', facilityController.getAll);

// GET /api/facilities/:id - Szczegóły obiektu (publiczny)
router.get('/:id', facilityController.getById);

// POST /api/facilities - Dodanie obiektu (tylko admin)
router.post('/', authenticate, authorizeAdmin, facilityController.create);

// PUT /api/facilities/:id - Edycja obiektu (tylko admin)
router.put('/:id', authenticate, authorizeAdmin, facilityController.update);

// DELETE /api/facilities/:id - Dezaktywacja obiektu (tylko admin)
router.delete('/:id', authenticate, authorizeAdmin, facilityController.remove);

module.exports = router;

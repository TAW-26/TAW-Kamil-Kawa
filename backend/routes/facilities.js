const express = require('express');
const facilityController = require('../controllers/facilityController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', facilityController.getAll);
router.get('/:id', facilityController.getById);
router.post('/', authenticate, authorizeAdmin, facilityController.create);
router.put('/:id', authenticate, authorizeAdmin, facilityController.update);
router.delete('/:id', authenticate, authorizeAdmin, facilityController.remove);

module.exports = router;

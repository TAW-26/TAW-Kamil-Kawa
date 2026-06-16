const express = require('express');
const reservationController = require('../controllers/reservationController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/my', authenticate, reservationController.getMy);
router.post('/', authenticate, reservationController.create);
router.patch('/:id/cancel', authenticate, reservationController.cancel);
router.patch('/:id/confirm', authenticate, authorizeAdmin, reservationController.confirm);
router.get('/', authenticate, authorizeAdmin, reservationController.getAll);

module.exports = router;

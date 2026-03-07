const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const authMiddleware = require('../middlewares/auth');
const { sanitizeInput } = require('../middlewares/validation');

router.post('/deposit', authMiddleware, sanitizeInput, feeController.deposit);
router.post('/withdraw', authMiddleware, sanitizeInput, feeController.withdraw);
router.get('/balance/:studentId', authMiddleware, feeController.getBalance);
router.get('/history/:studentId', authMiddleware, feeController.getHistory);

module.exports = router;

const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post('/deposit', authMiddleware, upload.single('proof'), feeController.deposit);
router.post('/withdraw', authMiddleware, upload.single('proof'), feeController.withdraw);
router.get('/balance/:studentId', authMiddleware, feeController.getBalance);
router.get('/history/:studentId', authMiddleware, feeController.getHistory);

module.exports = router;

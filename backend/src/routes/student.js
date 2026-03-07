const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/auth');

router.get('/:studentId/profile', authMiddleware, studentController.getProfile);
router.get('/:studentId/grades', authMiddleware, studentController.getGrades);
router.get('/:studentId/attendance', authMiddleware, studentController.getAttendance);
router.get('/:studentId/timetable', authMiddleware, studentController.getTimetable);

module.exports = router;

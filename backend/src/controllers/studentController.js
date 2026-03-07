const studentService = require('../services/studentService');
const { studentDTO, gradeDTO, attendanceDTO } = require('../dtos');

class StudentController {
  async getProfile(req, res) {
    try {
      const { studentId } = req.params;
      const student = await studentService.getStudentById(studentId);
      res.json({ student: studentDTO(student) });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getGrades(req, res) {
    try {
      const { studentId } = req.params;
      const grades = await studentService.getGrades(studentId);
      res.json({ grades: grades.map(gradeDTO) });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAttendance(req, res) {
    try {
      const { studentId } = req.params;
      const attendance = await studentService.getAttendance(studentId);
      res.json({ attendance: attendance.map(attendanceDTO) });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTimetable(req, res) {
    try {
      const { studentId } = req.params;
      const timetable = await studentService.getTimetable(studentId);
      res.json({ timetable });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new StudentController();

const prisma = require('../config/prisma');

class StudentService {
  async getStudentById(studentId) {
    return await prisma.student.findUnique({ where: { id: parseInt(studentId) } });
  }

  async getGrades(studentId) {
    return await prisma.grade.findMany({ where: { studentId: parseInt(studentId) } });
  }

  async getAttendance(studentId) {
    return await prisma.attendance.findMany({ where: { studentId: parseInt(studentId) } });
  }

  async getTimetable(studentId) {
    const student = await prisma.student.findUnique({ where: { id: parseInt(studentId) } });
    if (!student || !student.classId) {
      throw new Error('Student or class not found');
    }
    return await prisma.schedule.findMany({ where: { classId: student.classId } });
  }
}

module.exports = new StudentService();

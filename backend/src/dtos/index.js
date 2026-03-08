const userDTO = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  studentId: user.studentId
});

const studentDTO = (student) => ({
  id: student._id,
  name: student.name,
  email: student.email,
  feeBalance: student.feeBalance,
  classId: student.classId
});

const feeTransactionDTO = (transaction) => ({
  id: transaction._id || transaction.id,
  type: transaction.type,
  amount: transaction.amount,
  status: transaction.status,
  description: transaction.description,
  date: transaction.createdAt
});

const gradeDTO = (grade) => ({
  subject: grade.subject,
  grade: grade.grade,
  marks: grade.marks,
  date: grade.date
});

const attendanceDTO = (attendance) => ({
  date: attendance.date,
  status: attendance.status
});

module.exports = { userDTO, studentDTO, feeTransactionDTO, gradeDTO, attendanceDTO };

const prisma = require('../config/prisma');

class FeeService {
  async deposit(studentId, amount, description) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new Error('Student not found');
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { feeBalance: student.feeBalance + amount }
    });

    const transaction = await prisma.feeTransaction.create({
      data: {
        studentId,
        type: 'deposit',
        amount,
        status: 'completed',
        description
      }
    });

    return { student: updatedStudent, transaction };
  }

  async withdraw(studentId, amount, description) {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new Error('Student not found');
    }

    if (student.feeBalance < amount) {
      throw new Error('Insufficient balance');
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { feeBalance: student.feeBalance - amount }
    });

    const transaction = await prisma.feeTransaction.create({
      data: {
        studentId,
        type: 'withdraw',
        amount,
        status: 'pending',
        description
      }
    });

    return { student: updatedStudent, transaction };
  }

  async getTransactionHistory(studentId) {
    return await prisma.feeTransaction.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getFeeBalance(studentId) {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      throw new Error('Student not found');
    }
    return student.feeBalance;
  }
}

module.exports = new FeeService();

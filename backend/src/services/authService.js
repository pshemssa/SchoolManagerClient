const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { hashPassword, comparePassword } = require('../utils/crypto');

class AuthService {
  async register(data) {
    const { name, email, password, role, deviceId, studentId } = data;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const student = await prisma.student.findUnique({ where: { id: parseInt(studentId) } });
    if (!student) {
      throw new Error('Invalid student ID');
    }

    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        deviceId,
        isVerified: false,
        studentId: parseInt(studentId)
      }
    });

    return user;
  }

  async login(email, password, deviceId) {
    const user = await prisma.user.findUnique({ 
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.deviceId !== deviceId) {
      throw new Error('Device not recognized');
    }

    if (!user.isVerified) {
      throw new Error('Device not verified by admin');
    }

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role, studentId: user.studentId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token };
  }
}

module.exports = new AuthService();

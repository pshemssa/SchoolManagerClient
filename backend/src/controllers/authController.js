const authService = require('../services/authService');
const { userDTO } = require('../dtos');

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        message: 'Registration successful. Awaiting admin verification.',
        user: userDTO(user)
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password, deviceId } = req.body;
      const { user, token } = await authService.login(email, password, deviceId);
      
      res.json({
        message: 'Login successful',
        token,
        user: userDTO(user)
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res) {
    res.json({ message: 'Logout successful' });
  }
}

module.exports = new AuthController();

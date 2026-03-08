const feeService = require('../services/feeService');
const { feeTransactionDTO, studentDTO } = require('../dtos');
const cloudinary = require('../config/cloudinary');

class FeeController {
  async deposit(req, res) {
    try {
      const { studentId, amount, description } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'Proof of payment is required' });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'fee_proofs' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      const feeResult = await feeService.deposit(studentId, parseFloat(amount), description, result.secure_url);
      
      res.json({
        message: 'Payment submitted for verification',
        balance: feeResult.student.feeBalance,
        transaction: feeTransactionDTO(feeResult.transaction)
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async withdraw(req, res) {
    try {
      const { studentId, amount, description } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: 'Proof is required' });
      }

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'refund_proofs' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      const feeResult = await feeService.withdraw(studentId, parseFloat(amount), description, result.secure_url);
      
      res.json({
        message: 'Refund request submitted',
        balance: feeResult.student.feeBalance,
        transaction: feeTransactionDTO(feeResult.transaction)
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getBalance(req, res) {
    try {
      const { studentId } = req.params;
      const balance = await feeService.getFeeBalance(studentId);
      res.json({ balance });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getHistory(req, res) {
    try {
      const { studentId } = req.params;
      const transactions = await feeService.getTransactionHistory(studentId);
      res.json({
        transactions: transactions.map(feeTransactionDTO)
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new FeeController();

const feeService = require('../services/feeService');
const { feeTransactionDTO, studentDTO } = require('../dtos');

class FeeController {
  async deposit(req, res) {
    try {
      const { studentId, amount, description } = req.body;
      const result = await feeService.deposit(studentId, amount, description);
      
      res.json({
        message: 'Fee payment successful',
        balance: result.student.feeBalance,
        transaction: feeTransactionDTO(result.transaction)
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async withdraw(req, res) {
    try {
      const { studentId, amount, description } = req.body;
      const result = await feeService.withdraw(studentId, amount, description);
      
      res.json({
        message: 'Refund request submitted',
        balance: result.student.feeBalance,
        transaction: feeTransactionDTO(result.transaction)
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

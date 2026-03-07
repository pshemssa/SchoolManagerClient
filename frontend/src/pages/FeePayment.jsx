import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeService } from '../services/api';

export default function FeePayment() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('deposit');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.studentId || '123';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = { studentId, amount: parseFloat(amount), description };
      
      if (type === 'deposit') {
        await feeService.deposit(data);
        setSuccess('Payment successful!');
      } else {
        await feeService.withdraw(data);
        setSuccess('Refund request submitted!');
      }

      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>Fee Management</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Transaction Type:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          >
            <option value="deposit">Deposit (Payment)</option>
            <option value="withdraw">Withdraw (Refund Request)</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            step="0.01"
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px', minHeight: '80px' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

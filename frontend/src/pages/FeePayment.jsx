import { Shield } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { feeService } from '../services/api';

export default function FeePayment() {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState(searchParams.get('type') || 'deposit');
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.studentId;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5000000) {
      setError('File size must be less than 5MB');
      return;
    }
    setProofFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!proofFile) {
      setError('Please upload proof of payment');
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('studentId', studentId);
      formData.append('amount', amount);
      formData.append('description', description);
      formData.append('proof', proofFile);
      
      const token = localStorage.getItem('token');
      const endpoint = type === 'deposit' ? '/fee/deposit' : '/fee/withdraw';
      
      const response = await fetch(`http://localhost:5000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Transaction failed');
      }

      setSuccess(data.message);
      setTimeout(() => navigate('/fees'), 2000);
    } catch (err) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-5">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Shield/>
          </div>
          <h2 className="text-2xl font-bold">Fee Transaction</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-4">
            <option value="deposit">Deposit (Payment)</option>
            <option value="withdraw">Withdraw (Refund Request)</option>
          </select>

          <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
          <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" step="0.01" className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-4" />

          <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
          <textarea placeholder="Add a note..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-4" rows="3" />

          <label className="block text-sm font-medium text-gray-300 mb-2">Proof of Payment *</label>
          <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="w-full bg-gray-800 text-white px-4 py-2 rounded mb-4" required />
          {proofFile && <p className="text-green-400 text-sm mb-4">✓ {proofFile.name}</p>}

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-3">
            {loading ? 'Processing...' : 'Submit'}
          </button>
          <button type="button" onClick={() => navigate('/fees')} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feeService, studentService } from '../services/api';

export default function FeesPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.studentId || '123';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, historyRes, profileRes] = await Promise.all([
        feeService.getBalance(studentId),
        feeService.getHistory(studentId),
        studentService.getProfile(studentId)
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(historyRes.data.transactions);
      setStudentName(profileRes.data.student?.name || 'Student');
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
        `}
      >
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              <Shield/>
            </div>
            <div>
              <h2 className="font-semibold">SchoolSync</h2>
              <p className="text-xs text-gray-400">{user.role?.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-gray-400 hover:text-white">
            ×
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem icon="🏠" label="Dashboard" to="/dashboard" />
          <NavItem icon="💰" label="Fees" active={true} to="/fees" />
          <NavItem icon="📚" label="Academics" to="/academics/grades" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 space-y-3">
          <div className="px-3 py-2 bg-gray-800/50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Parent of:</p>
            <p className="text-sm font-medium text-gray-200">{studentName}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
          >
            <span>➜</span> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-gray-900 border-b border-gray-800 px-5 py-4 flex items-center justify-between lg:hidden">
          <button onClick={toggleSidebar} className="text-2xl">
            ☰
          </button>
          <span className="font-semibold">SchoolSync</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-5 md:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Fee Management</h1>
              <p className="text-gray-400 mt-1">View balance and transaction history.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Balance</p>
                  <p className={`text-3xl font-bold mt-1 ${balance < 1000 ? 'text-red-400' : 'text-green-400'}`}>
                    ${balance.toLocaleString()}
                  </p>
                  {balance < 1000 && <p className="text-red-400 text-sm mt-2">⚠️ Low balance warning</p>}
                </div>
                <div className="text-green-400 text-4xl">$</div>
              </div>
              <button
                onClick={() => navigate('/fee-payment')}
                className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                Make Payment
              </button>
              <button
                onClick={() => navigate('/fee-payment?type=withdraw')}
                className="w-full mt-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-medium transition"
              >
                Request Refund
              </button>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Transactions</p>
                  <p className="text-3xl font-bold mt-1">{transactions.length}</p>
                </div>
                <div className="text-blue-400 text-4xl">📊</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold">Transaction History</h2>
            </div>

            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-800/50">
                        <td className="px-6 py-4">{new Date(tx.createdAt || tx.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${tx.type === 'deposit' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">{tx.description || 'N/A'}</td>
                        <td className={`px-6 py-4 font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${tx.status === 'completed' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'}`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {transactions.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                  No transactions found.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false, to }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => to && navigate(to)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
        ${active ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-300 hover:bg-gray-800'}
      `}
    >
      <span className="w-6 text-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

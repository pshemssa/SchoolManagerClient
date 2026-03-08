// pages/client/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { feeService, studentService } from '../services/api';
import api from '../services/api';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [feeBalance, setFeeBalance] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.studentId;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, balanceRes, historyRes, gradesRes, attendanceRes] = await Promise.all([
        api.get(`/student/${studentId}/profile`),
        feeService.getBalance(studentId),
        feeService.getHistory(studentId),
        api.get(`/student/${studentId}/grades`),
        api.get(`/student/${studentId}/attendance`)
      ]);

      setStudentName(profileRes.data.student?.name || 'Student');
      setParentName(user.name || 'Parent');
      setFeeBalance(balanceRes.data.balance || 0);
      
      const grades = gradesRes.data.grades || [];
      const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + (g.marks || 0), 0) / grades.length / 100 * 4).toFixed(2) : 0;
      setGpa(avgGrade);

      const attendanceData = attendanceRes.data.attendance || [];
      const attendanceRate = attendanceData.length > 0 ? ((attendanceData.filter(a => a.status === 'present').length / attendanceData.length) * 100).toFixed(1) : 0;
      setAttendance(attendanceRate);

      const transactions = historyRes.data.transactions || [];
      setRecentTransactions(transactions.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
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
          <button className="lg:hidden text-gray-400 hover:text-white text-2xl" onClick={() => setSidebarOpen(false)}>
            ×
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem icon="🏠" label="Dashboard" active to="/dashboard" />
          <NavItem icon="💰" label="Fees" to="/fees" />
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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-5 py-4 flex items-center justify-between lg:hidden">
          <button onClick={toggleSidebar} className="text-2xl text-gray-300">
            ☰
          </button>
          <span className="font-semibold">SchoolSync</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-5 md:p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {parentName} 👋
          </h1>
          <p className="text-gray-400 mb-8">
            Here's an overview of {studentName}'s academic status.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            <StatCard title="Fee Balance" value={`$${feeBalance.toLocaleString()}`} icon="💰" color="text-cyan-400" />
            <StatCard title="GPA Average" value={gpa} icon="📈" color="text-green-400" />
            <StatCard title="Attendance" value={`${attendance}%`} icon="📅" color="text-orange-400" />
          </div>

          {/* Recent Transactions */}
          <section className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-10">
            <h2 className="text-xl font-semibold mb-5">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      tx.type === 'deposit' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                    }`}>
                      {tx.type === 'deposit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description || 'Transaction'}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.createdAt || tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2.5 py-1 rounded-full mt-1 inline-block ${
                      tx.status === 'completed' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {recentTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No recent transactions.
              </div>
            )}
          </section>

          {/* You can add Recent Grades here similarly if you want a preview */}
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 text-sm">{title}</p>
        <span className={`text-3xl ${color}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {trend && <span className="text-xs text-green-400 mt-1 block">↑ from last term</span>}
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
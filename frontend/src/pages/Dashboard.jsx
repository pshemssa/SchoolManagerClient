import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
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
  const { isDark, toggleTheme } = useTheme();
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
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 border-r
          ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
        `}
      >
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              <Shield/>
            </div>
            <div>
              <h2 className="font-semibold">SchoolSync</h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.role?.toUpperCase()}</p>
            </div>
          </div>
          <button className={`lg:hidden text-2xl ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`} onClick={() => setSidebarOpen(false)}>
            ×
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <NavItem icon="🏠" label="Dashboard" active to="/dashboard" />
          <NavItem icon="💰" label="Fees" to="/fees" />
          <NavItem icon="📚" label="Academics" to="/academics/grades" />
        </nav>

        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t space-y-3 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`px-3 py-2 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Parent of:</p>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{studentName}</p>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span>➜</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <header className={`border-b px-5 py-4 flex items-center justify-between lg:hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <button onClick={toggleSidebar} className={`text-2xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            ☰
          </button>
          <span className="font-semibold">SchoolSync</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-5 md:p-6 lg:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {parentName} 👋
          </h1>
          <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's an overview of {studentName}'s academic status.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            <StatCard title="Fee Balance" value={`$${feeBalance.toLocaleString()}`} icon="💰" color="text-cyan-400" />
            <StatCard title="GPA Average" value={gpa} icon="📈" color="text-green-400" />
            <StatCard title="Attendance" value={`${attendance}%`} icon="📅" color="text-orange-400" />
          </div>

          {/* Recent Transactions */}
          <section className={`rounded-xl border p-6 mb-10 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h2 className="text-xl font-semibold mb-5">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map(tx => (
                <div
                  key={tx.id}
                  className={`rounded-lg p-4 border flex items-center justify-between ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                      tx.type === 'deposit' ? isDark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600' : isDark ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type === 'deposit' ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description || 'Transaction'}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{new Date(tx.createdAt || tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2.5 py-1 rounded-full mt-1 inline-block ${
                      tx.status === 'completed' ? isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700' : isDark ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {recentTransactions.length === 0 && (
              <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
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
  const { isDark } = useTheme();
  return (
    <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
        <span className={`text-3xl ${color}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {trend && <span className="text-xs text-green-400 mt-1 block">↑ from last term</span>}
    </div>
  );
}

function NavItem({ icon, label, active = false, to }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => to && navigate(to)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition
        ${active ? 'bg-blue-600/20 text-blue-400 font-medium' : isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      <span className="w-6 text-center">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}
import { Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Academics() {
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.studentId;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('Fetching data for studentId:', studentId);
    try {
      const [gradesRes, attendanceRes, profileRes] = await Promise.all([
        api.get(`/student/${studentId}/grades`),
        api.get(`/student/${studentId}/attendance`),
        api.get(`/student/${studentId}/profile`)
      ]);
      console.log('Grades response:', gradesRes.data);
      console.log('Attendance response:', attendanceRes.data);
      setGrades(gradesRes.data.grades || []);
      setAttendance(attendanceRes.data.attendance || []);
      setStudentName(profileRes.data.student?.name || 'Student');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const avgGrade = grades.length > 0 ? (grades.reduce((sum, g) => sum + (g.marks || 0), 0) / grades.length).toFixed(1) : 0;
  const attendanceRate = attendance.length > 0 ? ((attendance.filter(a => a.status === 'present').length / attendance.length) * 100).toFixed(1) : 0;

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
          <NavItem icon="💰" label="Fees" to="/fees" />
          <NavItem icon="📚" label="Academics" active={true} to="/academics" />
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
              <h1 className="text-2xl md:text-3xl font-bold">Academics</h1>
              <p className="text-gray-400 mt-1">View grades and attendance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Average Grade</h3>
              <p className="text-4xl font-bold text-white">{avgGrade}%</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Attendance Rate</h3>
              <p className="text-4xl font-bold text-white">{attendanceRate}%</p>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <>
              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden mb-8">
                <div className="px-6 py-4 bg-gray-800">
                  <h2 className="text-xl font-semibold">Grades</h2>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {grades.map((grade, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 text-white">{grade.subject}</td>
                        <td className="px-6 py-4 text-gray-300">{grade.grade}</td>
                        <td className="px-6 py-4 text-gray-300">{grade.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {grades.length === 0 && (
                  <div className="py-12 text-center text-gray-500">No grades available.</div>
                )}
              </div>

              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 bg-gray-800">
                  <h2 className="text-xl font-semibold">Attendance</h2>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {attendance.map((att, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 text-white">{new Date(att.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${att.status === 'present' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {attendance.length === 0 && (
                  <div className="py-12 text-center text-gray-500">No attendance records.</div>
                )}
              </div>
            </>
          )}
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
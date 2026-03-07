// src/pages/client/academics/Attendance.tsx
export default function AttendancePage() {
  const stats = {
    present: 11,
    absent: 1,
    late: 2,
    excused: 1,
    rate: 73.3,
  };

  const log = [
    { date: "2025-03-03", status: "present", icon: "✅", color: "bg-green-900/50 text-green-300" },
    { date: "2025-03-04", status: "present", icon: "✅", color: "bg-green-900/50 text-green-300" },
    { date: "2025-03-05", status: "late",    icon: "⚠️", color: "bg-yellow-900/50 text-yellow-300" },
    { date: "2025-03-06", status: "absent",  icon: "❌", color: "bg-red-900/50 text-red-300" },
    // ...
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}

      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-5 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Academics</h1>
            <p className="text-gray-400 mt-1">Grades, attendance records, and class timetable.</p>
          </div>

          <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
            <NavLink label="Grades" to="/academics/grades" />
            <NavLink label="Attendance" active to="/academics/attendance" />
            <NavLink label="Timetable" to="/academics/timetable" />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-5 mb-10">
            <SummaryCard label="Present" value={stats.present} icon="✅" color="text-green-400" />
            <SummaryCard label="Absent" value={stats.absent} icon="❌" color="text-red-400" />
            <SummaryCard label="Late" value={stats.late} icon="⚠️" color="text-yellow-400" />
            <SummaryCard label="Excused" value={stats.excused} icon="⭕" color="text-gray-300" />
            <div className="col-span-2 sm:col-span-1 bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
              <p className="text-4xl font-bold text-cyan-400">{stats.rate}%</p>
              <p className="text-sm text-gray-400 mt-2">Overall Rate</p>
            </div>
          </div>

          {/* Attendance Log */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-5">Attendance Log</h2>
            <div className="space-y-3">
              {log.map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xl">
                      📅
                    </div>
                    <span className="font-medium">{entry.date}</span>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${entry.color}`}>
                    {entry.icon} {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, color }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 text-center">
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </div>
  );
}
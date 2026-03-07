// src/pages/client/academics/Grades.tsx
export default function GradesPage() {
  // Mock data – in real app: fetch from API
  const gpa = 3.72;
  const grades = [
    {
      subject: "Mathematics",
      term: "Term 1",
      score: "92/100",
      grade: "A",
      teacher: "Dr. Alan Turing",
      color: "bg-green-900/50 text-green-300",
    },
    {
      subject: "Computer Science",
      term: "Term 1",
      score: "97/100",
      grade: "A+",
      teacher: "Ms. Ada Lovelace",
      color: "bg-emerald-900/50 text-emerald-300",
    },
    {
      subject: "Physics",
      term: "Term 1",
      score: "85/100",
      grade: "B+",
      teacher: "Mr. Isaac Newton",
      color: "bg-yellow-900/50 text-yellow-300",
    },
    {
      subject: "Chemistry",
      term: "Term 1",
      score: "88/100",
      grade: "A-",
      teacher: "Ms. Marie Curie",
      color: "bg-cyan-900/50 text-cyan-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar - same as in Dashboard */}
      <aside className="...">{/* paste your sidebar code here */}</aside>

      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="bg-gray-900 border-b border-gray-800 px-5 py-4 flex items-center justify-between lg:hidden">
          <button className="text-2xl">☰</button>
          <span className="font-semibold">SchoolSync</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 p-5 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Academics</h1>
            <p className="text-gray-400 mt-1">
              Grades, attendance records, and class timetable.
            </p>
          </div>

          {/* Secondary nav */}
          <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
            <NavLink label="Grades" active to="/academics/grades" />
            <NavLink label="Attendance" to="/academics/attendance" />
            <NavLink label="Timetable" to="/academics/timetable" />
          </div>

          {/* Main content */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Grade Report</h2>
              <div className="bg-indigo-900/50 text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium">
                GPA: {gpa.toFixed(2)}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Term</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Grade</th>
                    <th className="px-6 py-4 font-medium">Teacher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {grades.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/60 transition-colors">
                      <td className="px-6 py-5 font-medium">{item.subject}</td>
                      <td className="px-6 py-5 text-gray-400">{item.term}</td>
                      <td className="px-6 py-5">{item.score}</td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${item.color}`}>
                          {item.grade}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-400">{item.teacher}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable secondary nav link
function NavLink({ label, active = false, to }) {
  return (
    <Link
      to={to}
      className={`
        px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2
        ${active 
          ? 'border-indigo-500 text-indigo-400' 
          : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'}
      `}
    >
      {label}
    </Link>
  );
}
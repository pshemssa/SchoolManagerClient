// src/pages/client/academics/Timetable.tsx
export default function TimetablePage() {
  const timetable = [
    {
      day: "Monday",
      classes: [
        {
          time: "08:00 - 08:45",
          subject: "Mathematics",
          teacher: "Dr. Alan Turing",
          room: "Room 101",
        },
        {
          time: "09:00 - 09:45",
          subject: "English",
          teacher: "Mr. William Shakespeare",
          room: "Room 205",
        },
        {
          time: "10:00 - 10:45",
          subject: "Physics",
          teacher: "Mr. Isaac Newton",
          room: "Lab 1",
        },
      ],
    },
    {
      day: "Tuesday",
      classes: [
        {
          time: "08:30 - 09:15",
          subject: "Chemistry",
          teacher: "Ms. Marie Curie",
          room: "Lab 2",
        },
        {
          time: "10:00 - 10:45",
          subject: "Computer Science",
          teacher: "Ms. Ada Lovelace",
          room: "Room 303",
        },
      ],
    },
    // Add more days...
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
            <NavLink label="Attendance" to="/academics/attendance" />
            <NavLink label="Timetable" active to="/academics/timetable" />
          </div>

          <div className="space-y-8">
            {timetable.map((day, i) => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-xl font-semibold mb-5">{day.day}</h2>
                <div className="space-y-4">
                  {day.classes.map((cls, j) => (
                    <div
                      key={j}
                      className="bg-gray-800 rounded-lg p-5 border border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium text-lg">{cls.time}</p>
                        <p className="text-gray-300 mt-1">{cls.subject}</p>
                        <p className="text-sm text-gray-500">{cls.teacher}</p>
                      </div>
                      <span className="bg-indigo-900/50 text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium">
                        {cls.room}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
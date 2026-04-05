export default function AnalyticsCard({ courses = [] }) {
  // Show top 6 courses by student count
  const top = [...courses]
    .sort((a, b) => (b.totalStudents ?? 0) - (a.totalStudents ?? 0))
    .slice(0, 6);

  const maxStudents = Math.max(...top.map((c) => c.totalStudents ?? 0), 1);
  const totalActive = courses.reduce((s, c) => s + (c.totalStudents ?? 0), 0);

  return (
    <div className="bg-surface-container-low p-8 rounded-2xl">
      <h3 className="text-lg font-bold mb-6 text-on-surface">Student Enrollment</h3>

      {top.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-on-surface-variant text-sm">
          No courses yet
        </div>
      ) : (
        <div className="flex items-end gap-3 h-32 mb-6">
          {top.map((course, idx) => {
            const pct = maxStudents > 0 ? ((course.totalStudents ?? 0) / maxStudents) * 100 : 0;
            return (
              <div
                key={course._id ?? idx}
                title={`${course.title}: ${course.totalStudents ?? 0} students`}
                style={{ height: `${Math.max(pct, 8)}%` }}
                className="flex-1 rounded-t-lg bg-primary/20 hover:bg-primary transition-colors cursor-pointer"
              />
            );
          })}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Total Enrolled Students</span>
          <span className="font-bold text-on-surface">{totalActive.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-secondary h-full transition-all"
            style={{ width: courses.length > 0 ? "100%" : "0%" }}
          />
        </div>
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">
          Across {courses.length} course{courses.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}

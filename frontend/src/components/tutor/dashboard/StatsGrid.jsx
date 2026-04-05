/**
 * StatsGrid — shows computed stats for the tutor's courses.
 * Props: totalCourses, totalStudents, totalPublished, avgRating
 */
export default function StatsGrid({ totalCourses = 0, totalStudents = 0, totalPublished = 0, avgRating = 0 }) {
  const STATS = [
    {
      icon: "menu_book",
      label: "Total Courses",
      value: totalCourses,
      sub: `${totalPublished} Published`,
      trend: "trending_up",
      bgColor: "bg-indigo-50",
      textColor: "text-primary",
    },
    {
      icon: "groups",
      label: "Total Students",
      value: totalStudents >= 1000 ? `${(totalStudents / 1000).toFixed(1)}k` : totalStudents,
      sub: "Enrolled",
      trend: "add",
      bgColor: "bg-emerald-50",
      textColor: "text-secondary",
    },
    {
      icon: "star",
      label: "Avg Rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "—",
      sub: "Across courses",
      trend: "arrow_upward",
      bgColor: "bg-amber-50",
      textColor: "text-tertiary",
    },
    {
      icon: "bolt",
      label: "Pending Review",
      value: totalCourses - totalPublished,
      sub: "Courses",
      trend: "hourglass_top",
      bgColor: "bg-purple-50",
      textColor: "text-indigo-400",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {STATS.map((stat, idx) => (
        <div
          key={idx}
          className="bg-surface-container-lowest p-6 rounded-2xl transition-all hover:shadow-xl hover:shadow-indigo-100/50 group border border-outline-variant/5"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${stat.bgColor} ${stat.textColor} rounded-xl group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <span className="text-xs font-bold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">{stat.trend}</span>
            </span>
          </div>
          <div className="text-3xl font-black text-on-surface">{stat.value}</div>
          <div className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
          <div className="text-[11px] text-outline mt-0.5">{stat.sub}</div>
        </div>
      ))}
    </section>
  );
}

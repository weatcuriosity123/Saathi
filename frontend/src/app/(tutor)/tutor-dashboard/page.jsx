import StatsGrid from "@/components/tutor/dashboard/StatsGrid";
import CourseList from "@/components/tutor/dashboard/CourseList";
import AnalyticsCard from "@/components/tutor/dashboard/AnalyticsCard";
import RecentEarnings from "@/components/tutor/dashboard/RecentEarnings";

export default function TutorDashboardPage() {
  return (
    <>
      {/* Dashboard Header & CTA */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Welcome back, Prof. Aris</h2>
          <p className="text-on-surface-variant mt-1">Here is what's happening with your courses today.</p>
        </div>
        <button className="group flex items-center gap-3 bg-[#F97316] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:translate-y-[-2px] transition-all duration-300 active:scale-95">
          <span className="material-symbols-outlined">add_circle</span>
          <span>Upload New Course</span>
        </button>
      </section>

      {/* Primary Metrics Grid */}
      <StatsGrid />

      {/* Bento Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Course Management (2/3 width) */}
        <CourseList />

        {/* Secondary Info Column (1/3 width) */}
        <div className="space-y-6">
          <AnalyticsCard />
          <RecentEarnings />
        </div>
      </div>
    </>
  );
}

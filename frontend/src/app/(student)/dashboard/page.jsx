import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import PageTemplate from "@/components/shared/PageTemplate";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        title="Student Dashboard"
        description="Track your learning activity"
        sections={[
          { title: "My Courses", content: "View enrolled courses and resume from where you left." },
          { title: "Assignments", content: "Check pending tasks and upcoming deadlines." },
        ]}
      />
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Weekly Progress</h2>
          <Badge tone="secondary">68%</Badge>
        </div>
        <ProgressBar value={68} />
      </div>
    </div>
  );
}

import PageTemplate from "@/components/shared/PageTemplate";
import Badge from "@/components/ui/Badge";

export default function CourseDetailPage({ params }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-text">Course Detail</h1>
        <Badge tone="accent">{params.courseId}</Badge>
      </div>
      <PageTemplate
        title="Course Overview"
        description="Detailed curriculum, tutor info, and enrollment details"
        sections={[
          { title: "Curriculum", content: "Module-wise breakdown and outcomes." },
          { title: "Tutor", content: "Instructor profile and expertise summary." },
        ]}
      />
    </div>
  );
}

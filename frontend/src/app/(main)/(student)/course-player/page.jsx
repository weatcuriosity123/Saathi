import Button from "@/components/ui/Button";
import PageTemplate from "@/components/shared/PageTemplate";

export default function CoursePlayerPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        title="Course Player"
        description="Watch lessons and continue learning"
        sections={[
          { title: "Current Lesson", content: "Video player and learning resources will be placed here." },
          { title: "Notes", content: "Save quick highlights from each chapter." },
        ]}
      />
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Video player placeholder
      </div>
      <Button>Mark as complete</Button>
    </div>
  );
}

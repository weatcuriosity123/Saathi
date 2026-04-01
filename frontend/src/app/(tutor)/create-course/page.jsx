import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageTemplate from "@/components/shared/PageTemplate";

export default function CreateCoursePage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        title="Create Course"
        description="Draft and publish a new course"
        sections={[
          { title: "Course Info", content: "Define title, category, and difficulty level." },
        ]}
      />
      <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <Input placeholder="Course title" />
        <Input placeholder="Category" />
        <Button type="submit">Save draft</Button>
      </form>
    </div>
  );
}

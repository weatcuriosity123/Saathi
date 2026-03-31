import PageTemplate from "@/components/shared/PageTemplate";
import Card from "@/components/ui/Card";

export default function CoursesListingPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        title="Courses"
        description="Explore all available learning paths"
        sections={[
          { title: "Featured", content: "Top-rated courses curated for this week." },
          { title: "Categories", content: "Browse development, design, marketing, and more." },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <h3 className="text-base font-semibold">Course {index + 1}</h3>
            <p className="mt-1 text-sm text-slate-600">Course card placeholder</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

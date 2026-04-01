import PageTemplate from "@/components/shared/PageTemplate";

export default function TutorDashboardPage() {
  return (
    <PageTemplate
      title="Tutor Dashboard"
      description="Manage courses and monitor student engagement"
      sections={[
        { title: "Published Courses", content: "View and update your live courses." },
        { title: "Performance", content: "Track ratings and completion trends." },
      ]}
    />
  );
}

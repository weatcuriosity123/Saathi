import Link from "next/link";
import PageTemplate from "@/components/shared/PageTemplate";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-text">SAATHI</h1>
        <Badge tone="secondary">E-Learning Platform</Badge>
      </div>

      <PageTemplate
        title="Home"
        description="Production-ready starter built for team collaboration and scalable feature delivery"
        sections={[
          {
            title: "Student Flows",
            content: "Dashboard, course player, and checkout modules with isolated route groups.",
          },
          {
            title: "Tutor Flows",
            content: "Dedicated tutor dashboard, course creation, and verification pages.",
          },
        ]}
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/courses">
          <Button>Browse Courses</Button>
        </Link>
        <Link href="/signup">
          <Button variant="accent">Create Account</Button>
        </Link>
      </div>
    </div>
  );
}

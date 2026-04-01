import Badge from "@/components/ui/Badge";
import PageTemplate from "@/components/shared/PageTemplate";

export default function VerificationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-text">Tutor Verification</h1>
        <Badge tone="secondary">Pending</Badge>
      </div>
      <PageTemplate
        title="Verification"
        description="Submit required information to become a verified tutor"
        sections={[
          { title: "Documents", content: "Upload identity and qualification documents." },
          { title: "Review", content: "Admin team will verify within 2-3 business days." },
        ]}
      />
    </div>
  );
}

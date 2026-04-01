import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageTemplate from "@/components/shared/PageTemplate";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        title="Signup"
        description="Create your SAATHI account"
        sections={[
          { title: "Start", content: "Register as a learner and begin exploring courses." },
        ]}
      />
      <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <Input type="text" placeholder="Full name" />
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button variant="accent" type="submit" className="w-full">
          Create account
        </Button>
      </form>
    </div>
  );
}

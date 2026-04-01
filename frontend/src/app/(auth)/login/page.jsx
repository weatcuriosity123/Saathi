import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PageTemplate from "@/components/shared/PageTemplate";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <PageTemplate
        title="Login"
        description="Welcome back to SAATHI"
        sections={[
          { title: "Access", content: "Sign in to continue your learning journey." },
        ]}
      />
      <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}

import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign Up | SAATHI",
  description: "Create your new SAATHI account today.",
};

export default function SignupPage() {
  return <AuthForm initialView="signup" />;
}


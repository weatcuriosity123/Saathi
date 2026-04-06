import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
  title: "Login | SAATHI",
  description: "Sign in to continue your learning journey on SAATHI.",
};

export default function LoginPage() {
  return <AuthForm initialView="login" />;
}


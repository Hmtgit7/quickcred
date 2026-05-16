import type { Metadata } from "next";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { LoginForm } from "@/modules/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your QuickCred account.",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue."
    >
      <LoginForm />
    </AuthCard>
  );
}
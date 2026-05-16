import type { Metadata } from "next";
import { AuthCard } from "@/modules/auth/components/AuthCard";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your QuickCred borrower account.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create your account"
      description="Borrow with confidence. Set up your account in minutes."
    >
      <RegisterForm />
    </AuthCard>
  );
}
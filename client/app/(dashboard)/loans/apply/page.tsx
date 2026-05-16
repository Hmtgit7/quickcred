import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { LoanApplyWizard } from "./_components/LoanApplyWizard";

export const metadata: Metadata = { title: "Apply for Loan" };

export default function LoanApplyPage() {
  return (
    <PageContainer size="narrow">
      <PageHeader
        title="Apply for a Loan"
        subtitle="Complete the steps below to submit your application."
      />
      <LoanApplyWizard />
    </PageContainer>
  );
}
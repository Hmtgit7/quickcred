import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { LoanDetailView } from "./_components/LoanDetailView";

export const metadata: Metadata = { title: "Loan Details" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LoanDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <PageContainer size="narrow">
      <LoanDetailView id={id} />
    </PageContainer>
  );
}
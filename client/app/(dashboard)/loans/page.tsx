import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { MyLoansList } from "./_components/MyLoansList";

export const metadata: Metadata = { title: "My Loans" };

export default function MyLoansPage() {
  return (
    <PageContainer>
      <PageHeader
        title="My Loans"
        subtitle="Track all your loan applications."
        action={
          <Button asChild size="sm">
            <Link href={ROUTES.LOANS.APPLY}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Apply for Loan
            </Link>
          </Button>
        }
      />
      <MyLoansList />
    </PageContainer>
  );
}
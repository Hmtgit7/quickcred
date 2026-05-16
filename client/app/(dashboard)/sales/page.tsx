import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Role } from "@/types/enums";
import { SalesLeadsTable } from "./_components/SalesLeadsTable";

export const metadata: Metadata = { title: "Sales" };

export default function SalesPage() {
  return (
    <RoleGuard roles={[Role.Sales, Role.Admin]}>
      <PageContainer size="wide">
        <PageHeader
          title="Sales Leads"
          subtitle="Borrowers who have registered but have not submitted a loan application yet."
        />
        <SalesLeadsTable />
      </PageContainer>
    </RoleGuard>
  );
}

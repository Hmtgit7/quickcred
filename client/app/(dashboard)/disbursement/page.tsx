import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Role } from "@/types/enums";
import { DisbursementTable } from "./_components/DisbursementTable";

export const metadata: Metadata = { title: "Disbursement" };

export default function DisbursementPage() {
  return (
    <RoleGuard roles={[Role.Disbursement, Role.Admin]}>
      <PageContainer size="wide">
        <PageHeader
          title="Disbursement Queue"
          subtitle="Sanctioned loans ready for fund disbursement."
        />
        <DisbursementTable />
      </PageContainer>
    </RoleGuard>
  );
}

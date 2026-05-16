import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Role } from "@/types/enums";
import { SanctionTable } from "./_components/SanctionTable";

export const metadata: Metadata = { title: "Sanction" };

export default function SanctionPage() {
  return (
    <RoleGuard roles={[Role.Sanction, Role.Admin]}>
      <PageContainer size="wide">
        <PageHeader
          title="Sanction Queue"
          subtitle="Review applied loans and approve or reject applications."
        />
        <SanctionTable />
      </PageContainer>
    </RoleGuard>
  );
}

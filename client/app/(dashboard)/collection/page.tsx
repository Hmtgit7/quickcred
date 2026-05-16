import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Role } from "@/types/enums";
import { CollectionTable } from "./_components/CollectionTable";

export const metadata: Metadata = { title: "Collection" };

export default function CollectionPage() {
  return (
    <RoleGuard roles={[Role.Collection, Role.Admin]}>
      <PageContainer size="wide">
        <PageHeader
          title="Collection"
          subtitle="Track repayments on active disbursed loans."
        />
        <CollectionTable />
      </PageContainer>
    </RoleGuard>
  );
}

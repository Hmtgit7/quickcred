import type { Metadata } from "next";
import { PageHeader } from "@/components/common/PageHeader";
import { RoleGuard } from "@/components/common/RoleGuard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Role } from "@/types/enums";
import { AnalyticsContent } from "./_components/AnalyticsContent";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <RoleGuard roles={[Role.Admin]}>
      <PageContainer size="wide">
        <PageHeader
          title="Analytics"
          subtitle="Platform-wide loan and repayment insights."
        />
        <AnalyticsContent />
      </PageContainer>
    </RoleGuard>
  );
}

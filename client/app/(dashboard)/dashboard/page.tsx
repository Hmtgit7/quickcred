"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { ROLE_ROUTES, ROUTES } from "@/constants/routes";
import { Role } from "@/types/enums";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { BorrowerDashboard } from "./_components/BorrowerDashboard";
import { AnalyticsContent } from "../analytics/_components/AnalyticsContent";
import { AnalyticsSkeleton } from "../analytics/_components/AnalyticsSkeleton";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    // Executives get redirected to their module; only borrowers and admins land here.
    if (user.role !== Role.Borrower && user.role !== Role.Admin) {
      router.replace(ROLE_ROUTES[user.role] ?? ROUTES.DASHBOARD);
    }
  }, [user, router]);

  if (!user) {
    return (
      <PageContainer size="wide">
        <div className="mb-6 space-y-2">
          <div className="skeleton-shimmer h-10 w-80 max-w-full rounded-md" />
          <div className="skeleton-shimmer h-4 w-96 max-w-full rounded-md" />
        </div>
        <AnalyticsSkeleton />
      </PageContainer>
    );
  }

  if (user.role === Role.Borrower) {
    return (
      <PageContainer>
        <BorrowerDashboard user={user} />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="wide">
      <PageHeader
        title={`Welcome, ${user.fullName ?? user.email}`}
        subtitle="Here's what's happening across QuickCred today."
      />
      <AnalyticsContent />
    </PageContainer>
  );
}

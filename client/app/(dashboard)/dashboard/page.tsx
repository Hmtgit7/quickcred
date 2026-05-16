"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/authStore";
import { ROLE_ROUTES, ROUTES } from "@/constants/routes";
import { Role } from "@/types/enums";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { BorrowerDashboard } from "./_components/BorrowerDashboard";
import { Skeleton, SkeletonCard } from "@/components/common/Skeleton";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    // Executives get redirected to their module — only borrowers & admins land here
    if (user.role !== Role.Borrower && user.role !== Role.Admin) {
      router.replace(ROLE_ROUTES[user.role] ?? ROUTES.DASHBOARD);
    }
  }, [user, router]);

  if (!user) {
    return (
      <PageContainer>
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
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

  // Admin sees analytics — redirect handled above for others
  return (
    <PageContainer>
      <PageHeader
        title={`Welcome, ${user.fullName ?? user.email}`}
        subtitle="Here's what's happening across QuickCred today."
      />
      <p className="text-sm text-muted-foreground">
        Loading your dashboard…
      </p>
    </PageContainer>
  );
}
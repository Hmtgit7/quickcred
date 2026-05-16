"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Users } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useLeads } from "@/modules/users/hooks/useLeads";
import { LoanStatus } from "@/types/enums";
import type { User } from "@/types/user.types";
import { formatCurrency, formatDate } from "@/lib/utils";

export function SalesLeadsTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLeads(page, 10);

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "Borrower",
      render: (user) => (
        <div>
          <p className="font-medium">{user.fullName ?? "Profile pending"}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      ),
    },
    {
      key: "profile",
      header: "Profile",
      render: (user) =>
        user.profileCompleted ? (
          <StatusBadge status={LoanStatus.Closed} />
        ) : (
          <StatusBadge status={LoanStatus.Pending} />
        ),
    },
    {
      key: "salary",
      header: "Salary",
      className: "tabular-nums",
      render: (user) =>
        user.monthlySalary ? formatCurrency(user.monthlySalary) : "Not added",
    },
    {
      key: "employment",
      header: "Employment",
      render: (user) => user.employmentMode ?? "Not added",
    },
    {
      key: "joined",
      header: "Registered",
      render: (user) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: () => (
        <Button asChild size="sm" variant="outline">
          <Link href={ROUTES.PROFILE}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            View profile
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        keyExtractor={(user) => user._id}
        isLoading={isLoading}
        emptyIcon={Users}
        emptyTitle="No leads available"
        emptyDescription="Registered borrowers without loan applications will appear here."
      />
      {data && <DataTablePagination meta={data} onPageChange={setPage} />}
    </div>
  );
}

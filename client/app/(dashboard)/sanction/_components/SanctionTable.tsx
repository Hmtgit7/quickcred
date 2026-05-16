"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SanctionActionModal } from "./SanctionActionModal";
import { SanctionRow } from "./SanctionRow";
import { useAllLoans } from "@/modules/loans/hooks/useAllLoans";
import { LoanStatus } from "@/types/enums";
import type { Loan } from "@/types/loan.types";
import type { User } from "@/types/user.types";
import { formatCurrency, formatDate } from "@/lib/utils";

function getBorrower(loan: Loan): Pick<User, "_id" | "fullName" | "email"> | null {
  if (loan.borrower) return loan.borrower;
  return typeof loan.borrowerId === "object" ? loan.borrowerId : null;
}

export function SanctionTable() {
  const [page, setPage] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);
  const { data, isLoading } = useAllLoans(page, 10, LoanStatus.Applied);

  const columns = useMemo<Column<Loan>[]>(
    () => [
      {
        key: "id",
        header: "Loan ID",
        render: (loan) => (
          <span className="font-mono text-xs">
            #{loan._id.slice(-8).toUpperCase()}
          </span>
        ),
      },
      {
        key: "borrower",
        header: "Borrower",
        render: (loan) => {
          const borrower = getBorrower(loan);
          return (
            <div>
              <p className="font-medium">{borrower?.fullName ?? "Borrower"}</p>
              <p className="text-xs text-muted-foreground">
                {borrower?.email ?? "Email unavailable"}
              </p>
            </div>
          );
        },
      },
      {
        key: "amount",
        header: "Principal",
        className: "tabular-nums",
        render: (loan) => (
          <span className="font-semibold">
            {formatCurrency(loan.principalAmount)}
          </span>
        ),
      },
      {
        key: "tenure",
        header: "Tenure",
        render: (loan) => `${loan.tenureDays} days`,
      },
      {
        key: "repayment",
        header: "Repayment",
        className: "tabular-nums",
        render: (loan) => formatCurrency(loan.totalRepayment),
      },
      {
        key: "status",
        header: "Status",
        render: (loan) => <StatusBadge status={loan.status} />,
      },
      {
        key: "applied",
        header: "Applied",
        render: (loan) => (
          <span className="text-xs text-muted-foreground">
            {formatDate(loan.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (loan) => (
          <SanctionRow
            loan={loan}
            onApprove={(nextLoan) => {
              setSelectedLoan(nextLoan);
              setAction("approve");
            }}
            onReject={(nextLoan) => {
              setSelectedLoan(nextLoan);
              setAction("reject");
            }}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="space-y-2">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          keyExtractor={(loan) => loan._id}
          isLoading={isLoading}
          emptyIcon={ClipboardList}
          emptyTitle="No applications in queue"
          emptyDescription="Applied loans pending sanction will appear here."
        />
        {data && <DataTablePagination meta={data} onPageChange={setPage} />}
      </div>

      <SanctionActionModal
        loan={selectedLoan}
        action={action}
        onClose={() => {
          setSelectedLoan(null);
          setAction(null);
        }}
      />
    </>
  );
}

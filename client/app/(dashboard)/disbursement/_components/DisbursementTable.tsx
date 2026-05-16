"use client";

import { useMemo, useState } from "react";
import { Banknote } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DisburseConfirmDialog } from "./DisburseConfirmDialog";
import { DisbursementRow } from "./DisbursementRow";
import { useAllLoans } from "@/modules/loans/hooks/useAllLoans";
import { LoanStatus } from "@/types/enums";
import type { Loan } from "@/types/loan.types";
import type { User } from "@/types/user.types";
import { formatCurrency, formatDate } from "@/lib/utils";

function getBorrower(loan: Loan): Pick<User, "_id" | "fullName" | "email"> | null {
  if (loan.borrower) return loan.borrower;
  return typeof loan.borrowerId === "object" ? loan.borrowerId : null;
}

export function DisbursementTable() {
  const [page, setPage] = useState(1);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const { data, isLoading } = useAllLoans(page, 10, LoanStatus.Sanctioned);

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
        key: "principal",
        header: "Principal",
        className: "tabular-nums",
        render: (loan) => (
          <span className="font-semibold">
            {formatCurrency(loan.principalAmount)}
          </span>
        ),
      },
      {
        key: "interest",
        header: "Interest",
        className: "tabular-nums",
        render: (loan) => formatCurrency(loan.simpleInterest),
      },
      {
        key: "repayment",
        header: "Total repayment",
        className: "tabular-nums",
        render: (loan) => (
          <span className="font-semibold text-primary">
            {formatCurrency(loan.totalRepayment)}
          </span>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (loan) => <StatusBadge status={loan.status} />,
      },
      {
        key: "sanctioned",
        header: "Sanctioned",
        render: (loan) => (
          <span className="text-xs text-muted-foreground">
            {loan.sanctionedAt ? formatDate(loan.sanctionedAt) : "-"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (loan) => (
          <DisbursementRow loan={loan} onDisburse={setSelectedLoan} />
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
          emptyIcon={Banknote}
          emptyTitle="No loans awaiting disbursement"
          emptyDescription="Sanctioned loans pending fund transfer will appear here."
        />
        {data && <DataTablePagination meta={data} onPageChange={setPage} />}
      </div>

      <DisburseConfirmDialog
        loan={selectedLoan}
        onClose={() => setSelectedLoan(null)}
      />
    </>
  );
}

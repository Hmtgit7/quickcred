"use client";

import { useMemo, useState } from "react";
import { CreditCard } from "lucide-react";
import { DataTable, type Column } from "@/components/common/DataTable";
import { DataTablePagination } from "@/components/common/DataTablePagination";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAllLoans } from "@/modules/loans/hooks/useAllLoans";
import { LoanStatus } from "@/types/enums";
import type { Loan } from "@/types/loan.types";
import { CollectionOutstandingCell } from "./CollectionOutstandingCell";
import { CollectionRow } from "./CollectionRow";
import { getLoanBorrower } from "./loanBorrower";
import { PaymentHistoryPanel } from "./PaymentHistoryPanel";
import { RecordPaymentModal } from "./RecordPaymentModal";

export function CollectionTable() {
  const [page, setPage] = useState(1);
  const [paymentLoan, setPaymentLoan] = useState<Loan | null>(null);
  const [historyLoan, setHistoryLoan] = useState<Loan | null>(null);
  const { data, isLoading } = useAllLoans(page, 10, LoanStatus.Disbursed);

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
          const borrower = getLoanBorrower(loan);
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
        render: (loan) => formatCurrency(loan.principalAmount),
      },
      {
        key: "totalRepayment",
        header: "Total due",
        className: "tabular-nums",
        render: (loan) => (
          <span className="font-semibold">
            {formatCurrency(loan.totalRepayment)}
          </span>
        ),
      },
      {
        key: "outstanding",
        header: "Outstanding",
        render: (loan) => <CollectionOutstandingCell loan={loan} />,
      },
      {
        key: "status",
        header: "Status",
        render: (loan) => <StatusBadge status={loan.status} />,
      },
      {
        key: "disbursedAt",
        header: "Disbursed",
        render: (loan) => (
          <span className="text-xs text-muted-foreground">
            {loan.disbursedAt ? formatDate(loan.disbursedAt) : "-"}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (loan) => (
          <CollectionRow
            loan={loan}
            onRecordPayment={setPaymentLoan}
            onViewHistory={setHistoryLoan}
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
          emptyIcon={CreditCard}
          emptyTitle="No active collections"
          emptyDescription="Disbursed loans pending repayment will appear here."
        />
        {data && <DataTablePagination meta={data} onPageChange={setPage} />}
      </div>

      <RecordPaymentModal
        loan={paymentLoan}
        onClose={() => setPaymentLoan(null)}
      />
      <PaymentHistoryPanel
        loan={historyLoan}
        onClose={() => setHistoryLoan(null)}
      />
    </>
  );
}

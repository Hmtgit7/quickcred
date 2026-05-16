"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Loan } from "@/types/loan.types";

interface SanctionRowProps {
  loan: Loan;
  onApprove: (loan: Loan) => void;
  onReject: (loan: Loan) => void;
}

export function SanctionRow({ loan, onApprove, onReject }: SanctionRowProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="border-green-200 text-green-700 hover:border-green-400 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
        onClick={() => onApprove(loan)}
      >
        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="border-red-200 text-red-700 hover:border-red-400 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
        onClick={() => onReject(loan)}
      >
        <XCircle className="mr-1.5 h-3.5 w-3.5" />
        Reject
      </Button>
    </div>
  );
}

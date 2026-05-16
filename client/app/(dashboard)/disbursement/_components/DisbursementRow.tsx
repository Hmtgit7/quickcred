"use client";

import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Loan } from "@/types/loan.types";

interface DisbursementRowProps {
  loan: Loan;
  onDisburse: (loan: Loan) => void;
}

export function DisbursementRow({ loan, onDisburse }: DisbursementRowProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="border-primary/30 text-primary hover:border-primary hover:bg-primary/5"
      onClick={() => onDisburse(loan)}
    >
      <Banknote className="mr-1.5 h-3.5 w-3.5" />
      Disburse
    </Button>
  );
}

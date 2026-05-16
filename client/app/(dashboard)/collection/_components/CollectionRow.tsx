"use client";

import { History, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Loan } from "@/types/loan.types";

interface CollectionRowProps {
  loan: Loan;
  onRecordPayment: (loan: Loan) => void;
  onViewHistory: (loan: Loan) => void;
}

export function CollectionRow({
  loan,
  onRecordPayment,
  onViewHistory,
}: CollectionRowProps) {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="sm"
        variant="outline"
        className="border-primary/30 text-primary hover:border-primary hover:bg-primary/5"
        onClick={() => onRecordPayment(loan)}
      >
        <PlusCircle />
        Record
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onViewHistory(loan)}>
        <History />
        History
      </Button>
    </div>
  );
}

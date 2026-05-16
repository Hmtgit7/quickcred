"use client";

import { useState } from "react";
import { Banknote, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDisburseLoan } from "@/modules/loans/hooks/useDisburseLoan";
import type { Loan } from "@/types/loan.types";
import type { User } from "@/types/user.types";
import { formatCurrency } from "@/lib/utils";

interface DisburseConfirmDialogProps {
  loan: Loan | null;
  onClose: () => void;
}

function getBorrower(loan: Loan): Pick<User, "_id" | "fullName" | "email"> | null {
  if (loan.borrower) return loan.borrower;
  return typeof loan.borrowerId === "object" ? loan.borrowerId : null;
}

export function DisburseConfirmDialog({
  loan,
  onClose,
}: DisburseConfirmDialogProps) {
  const [utr, setUtr] = useState("");
  const { mutate: disburse, isPending } = useDisburseLoan();
  const borrower = loan ? getBorrower(loan) : null;
  const normalizedUtr = utr.trim().toUpperCase();
  const utrValid = /^[A-Z0-9]{10,22}$/.test(normalizedUtr);

  const handleClose = () => {
    setUtr("");
    onClose();
  };

  const handleConfirm = () => {
    if (!loan || !utrValid) return;
    disburse(
      { id: loan._id, disbursalUtrNumber: normalizedUtr },
      { onSuccess: handleClose }
    );
  };

  return (
    <AlertDialog open={Boolean(loan)} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Confirm Disbursement
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the transfer as disbursed and notify the borrower.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 text-sm">
          <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
            <InfoRow label="Loan ID" value={`#${loan?._id.slice(-8).toUpperCase() ?? "-"}`} />
            <InfoRow label="Borrower" value={borrower?.fullName ?? "Borrower"} />
            <InfoRow
              label="Principal"
              value={loan ? formatCurrency(loan.principalAmount) : "-"}
            />
            <InfoRow
              label="Total repayment"
              value={loan ? formatCurrency(loan.totalRepayment) : "-"}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="disbursal-utr">
              Disbursal UTR <span className="text-destructive">*</span>
            </Label>
            <Input
              id="disbursal-utr"
              value={utr}
              onChange={(event) => setUtr(event.target.value.toUpperCase())}
              placeholder="UTR1234567890"
              disabled={isPending}
              maxLength={22}
              aria-invalid={utr.length > 0 && !utrValid}
            />
            <p className="text-xs text-muted-foreground">
              Use 10-22 uppercase letters and digits.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending} onClick={handleClose}>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleConfirm} disabled={isPending || !utrValid}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Disbursing..." : "Confirm Disburse"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium tabular-nums">{value}</span>
    </div>
  );
}

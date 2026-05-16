"use client";

import { useState } from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSanctionLoan } from "@/modules/loans/hooks/useSanctionLoan";
import { formatCurrency } from "@/lib/utils";
import type { Loan } from "@/types/loan.types";

interface SanctionActionModalProps {
  loan: Loan | null;
  action: "approve" | "reject" | null;
  onClose: () => void;
}

export function SanctionActionModal({
  loan,
  action,
  onClose,
}: SanctionActionModalProps) {
  const [reason, setReason] = useState("");
  const { mutate: sanctionLoan, isPending } = useSanctionLoan();
  const isReject = action === "reject";

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleConfirm = () => {
    if (!loan || !action) return;
    sanctionLoan(
      {
        id: loan._id,
        action,
        rejectionReason: isReject ? reason.trim() : undefined,
      },
      { onSuccess: handleClose }
    );
  };

  return (
    <Dialog open={Boolean(loan && action)} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isReject ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {isReject ? "Reject Loan" : "Approve Loan"}
          </DialogTitle>
          <DialogDescription>
            {loan ? (
              <>
                Loan{" "}
                <span className="font-mono font-medium">
                  #{loan._id.slice(-8).toUpperCase()}
                </span>{" "}
                for{" "}
                <span className="font-medium">
                  {formatCurrency(loan.principalAmount)}
                </span>{" "}
                over {loan.tenureDays} days.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        {isReject ? (
          <div className="space-y-1.5">
            <Label htmlFor="rejection-reason">
              Rejection reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Explain why this loan is being rejected..."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              disabled={isPending}
              className="resize-none"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            This moves the application to sanctioned status and notifies the borrower.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant={isReject ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending || (isReject && !reason.trim())}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending
              ? "Processing..."
              : isReject
                ? "Confirm Rejection"
                : "Confirm Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

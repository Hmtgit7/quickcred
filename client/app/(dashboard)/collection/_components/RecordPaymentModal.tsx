"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { IndianRupee, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { useLoanPayments } from "@/modules/payments/hooks/useLoanPayments";
import { useRecordPayment } from "@/modules/payments/hooks/useRecordPayment";
import {
  recordPaymentSchema,
  type RecordPaymentFormData,
} from "@/modules/payments/types/payment.schemas";
import type { Loan } from "@/types/loan.types";
import { getLoanBorrower } from "./loanBorrower";
import { OutstandingBadge } from "./OutstandingBadge";

interface RecordPaymentModalProps {
  loan: Loan | null;
  onClose: () => void;
}

export function RecordPaymentModal({ loan, onClose }: RecordPaymentModalProps) {
  const { mutate: recordPayment, isPending } = useRecordPayment();
  const { data: summary } = useLoanPayments(loan?._id ?? "");
  const borrower = loan ? getLoanBorrower(loan) : null;
  const maxPayable = summary?.outstanding ?? loan?.outstandingAmount ?? loan?.totalRepayment ?? 0;

  const form = useForm<RecordPaymentFormData>({
    resolver: zodResolver(
      recordPaymentSchema.refine((data) => data.amount <= maxPayable, {
        message: `Amount cannot exceed outstanding balance (${formatCurrency(maxPayable)})`,
        path: ["amount"],
      }) as never
    ),
    defaultValues: {
      amount: 0,
      utrNumber: "",
      paymentDate: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (!loan) return;
    form.reset({
      amount: 0,
      utrNumber: "",
      paymentDate: new Date().toISOString().slice(0, 10),
    });
  }, [form, loan]);

  const handleClose = () => {
    if (isPending) return;
    form.reset();
    onClose();
  };

  const onSubmit = (data: RecordPaymentFormData) => {
    if (!loan) return;
    recordPayment(
      {
        loanId: loan._id,
        amount: data.amount,
        utrNumber: data.utrNumber.toUpperCase(),
        paymentDate: data.paymentDate,
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  };

  const watchedAmount =
    useWatch({ control: form.control, name: "amount" }) ?? 0;
  const newOutstanding = Math.max(0, maxPayable - (watchedAmount || 0));
  const willClose = newOutstanding === 0 && watchedAmount > 0;

  return (
    <Dialog open={Boolean(loan)} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" />
            Record Payment
          </DialogTitle>
          <DialogDescription>
            {loan && (
              <>
                Loan{" "}
                <span className="font-mono font-medium">
                  #{loan._id.slice(-8).toUpperCase()}
                </span>{" "}
                - {borrower?.fullName ?? "Borrower"}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {summary && (
          <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Total due</p>
                <p className="font-semibold tabular-nums">
                  {formatCurrency(summary.totalRepayment)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paid so far</p>
                <p className="font-semibold tabular-nums text-green-600 dark:text-green-400">
                  {formatCurrency(summary.totalPaid)}
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">Outstanding</p>
              <OutstandingBadge
                outstanding={summary.outstanding}
                totalRepayment={summary.totalRepayment}
              />
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        Rs.
                      </span>
                      <Input
                        type="number"
                        min={1}
                        max={maxPayable || undefined}
                        placeholder="0"
                        className="pl-10 tabular-nums"
                        disabled={isPending}
                        {...field}
                        onChange={(event) =>
                          field.onChange(Number(event.target.value) || 0)
                        }
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Max payable:{" "}
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                      onClick={() =>
                        form.setValue("amount", maxPayable, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    >
                      {formatCurrency(maxPayable)}
                    </button>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="utrNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UTR number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="HDFC0000123456789"
                      className="font-mono uppercase"
                      maxLength={22}
                      disabled={isPending}
                      {...field}
                      onChange={(event) =>
                        field.onChange(event.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Unique transaction reference from the bank transfer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      max={new Date().toISOString().slice(0, 10)}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedAmount > 0 && (
              <div className="space-y-1 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-xs font-medium text-primary">After this payment</p>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Remaining outstanding
                  </span>
                  <span className="font-bold tabular-nums">
                    {formatCurrency(newOutstanding)}
                  </span>
                </div>
                {willClose && (
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                    This payment will fully close the loan.
                  </p>
                )}
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                {isPending ? "Recording..." : "Record Payment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

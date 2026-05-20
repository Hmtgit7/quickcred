"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SliderWithInput } from "@/components/forms/SliderWithInput";
import { useApplyLoan } from "@/modules/loans/hooks/useApplyLoan";
import { LOAN_CONSTANTS } from "@/constants/app.constants";
import { calculateLoan, formatCurrency } from "@/lib/utils";

interface StepLoanConfigProps {
  onBack: () => void;
  salarySlipDocId?: string;
}

export function StepLoanConfig({ onBack, salarySlipDocId }: StepLoanConfigProps) {
  const [principal, setPrincipal] = useState<number>(LOAN_CONSTANTS.MIN_AMOUNT);
  const [tenure, setTenure] = useState<number>(LOAN_CONSTANTS.MIN_TENURE_DAYS);
  const { mutate: applyLoan, isPending } = useApplyLoan();

  const calc = calculateLoan(principal, tenure);

  const handleApply = () => {
    applyLoan({
      principalAmount: principal,
      tenureDays: tenure,
      salarySlipDocId,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">Loan Configuration</h3>
        <p className="text-xs text-muted-foreground">
          Use the sliders to set your desired loan amount and tenure. The repayment summary updates live.
        </p>
      </div>

      <div className="space-y-6">
        <SliderWithInput
          label="Loan Amount"
          value={principal}
          onChange={setPrincipal}
          min={LOAN_CONSTANTS.MIN_AMOUNT}
          max={LOAN_CONSTANTS.MAX_AMOUNT}
          step={LOAN_CONSTANTS.AMOUNT_STEP}
          formatDisplay={(v) => `₹${v.toLocaleString("en-IN")}`}
        />

        <SliderWithInput
          label="Tenure"
          value={tenure}
          onChange={setTenure}
          min={LOAN_CONSTANTS.MIN_TENURE_DAYS}
          max={LOAN_CONSTANTS.MAX_TENURE_DAYS}
          step={1}
          formatDisplay={(v) => `${v}`}
          suffix="days"
        />
      </div>

      <Card className="bg-muted/40 border-border/60">
        <CardContent className="pt-5 pb-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Repayment Summary
          </p>

          <div className="space-y-2">
            <CalcRow label="Principal Amount" value={formatCurrency(calc.principal)} />
            <CalcRow label="Interest Rate" value={`${calc.interestRate}% p.a.`} />
            <CalcRow label="Tenure" value={`${calc.tenureDays} days`} />
            <CalcRow
              label="Simple Interest"
              value={formatCurrency(calc.simpleInterest)}
              sub="P × R × T / (365 × 100)"
            />
            <Separator />
            <CalcRow
              label="Total Repayment"
              value={formatCurrency(calc.totalRepayment)}
              highlight
            />
          </div>

          <p className="text-xs text-muted-foreground pt-1">
            SI = {formatCurrency(calc.principal)} × {calc.interestRate}% × {calc.tenureDays} / (365 × 100)
            = <span className="font-medium text-foreground">{formatCurrency(calc.simpleInterest)}</span>
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onBack}
          disabled={isPending}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button className="flex-1" onClick={handleApply} disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Submitting…" : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}

interface CalcRowProps {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

function CalcRow({ label, value, sub, highlight }: CalcRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className={`text-sm ${highlight ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
          {label}
        </p>
        {sub && <p className="text-xs text-muted-foreground font-mono">{sub}</p>}
      </div>
      <p className={`tabular-nums ${highlight ? "text-base font-bold text-primary" : "text-sm font-medium text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
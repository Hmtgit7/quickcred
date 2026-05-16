"use client";

import Link from "next/link";
import { ArrowRight, Calendar, IndianRupee } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import type { Loan } from "@/types/loan.types";

interface LoanCardProps {
  loan: Loan;
}

export function LoanCard({ loan }: LoanCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 flex-row items-start justify-between space-y-0">
        <div>
          <p className="text-xs text-muted-foreground font-mono">
            #{loan._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-lg font-bold tabular-nums mt-0.5">
            {formatCurrency(loan.principalAmount)}
          </p>
        </div>
        <StatusBadge status={loan.status} />
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{loan.tenureDays} days</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <IndianRupee className="h-3.5 w-3.5 shrink-0" />
            <span className="tabular-nums">{formatCurrency(loan.totalRepayment)} total</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            Applied {formatDate(loan.createdAt)}
          </p>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
            <Link href={ROUTES.LOANS.DETAIL(loan._id)}>
              View details
              <ArrowRight className="ml-1.5 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
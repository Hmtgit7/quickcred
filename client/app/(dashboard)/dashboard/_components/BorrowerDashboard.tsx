"use client";

import Link from "next/link";
import { ArrowRight, PlusCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/lib/utils";
import type { User } from "@/types/user.types";
import { MyLoansList } from "../../loans/_components/MyLoansList";

interface BorrowerDashboardProps {
    user: User;
}

export function BorrowerDashboard({ user }: BorrowerDashboardProps) {
    const isProfileComplete = user.profileCompleted;
    const firstName = user.fullName?.split(" ")[0] ?? "there";

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Good day, ${firstName} 👋`}
                subtitle="Manage your loan applications from here."
                action={
                    isProfileComplete ? (
                        <Button asChild size="sm">
                            <Link href={ROUTES.LOANS.APPLY}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Apply for Loan
                            </Link>
                        </Button>
                    ) : undefined
                }
            />

            {/* Profile incomplete banner */}
            {!isProfileComplete && (
                <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
                    <CardContent className="flex items-center justify-between gap-4 py-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                    Complete your profile to apply for a loan
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                                    We need a few more details to check your eligibility.
                                </p>
                            </div>
                        </div>
                        <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-amber-300 hover:bg-amber-100 dark:border-amber-700"
                        >
                            <Link href={ROUTES.PROFILE}>
                                Complete profile
                                <ArrowRight className="ml-2 h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Quick stats row */}
            {isProfileComplete && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <QuickStatCard
                        label="Monthly Salary"
                        value={formatCurrency(user.monthlySalary ?? 0)}
                        sub="Verified income"
                    />
                    <QuickStatCard
                        label="Max Eligible Loan"
                        value={formatCurrency(500_000)}
                        sub="Up to ₹5,00,000"
                    />
                    <QuickStatCard
                        label="Interest Rate"
                        value="12% p.a."
                        sub="Simple interest"
                    />
                </div>
            )}

            {/* Loans section */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold">My Loans</h2>
                        <p className="text-xs text-muted-foreground">
                            Your active and past loan applications
                        </p>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-xs">
                        <Link href={ROUTES.LOANS.ROOT}>
                            View all
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>
                <MyLoansList showApplyAction={isProfileComplete} />
            </section>
        </div>
    );
}

/* ── Quick stat card ──────────────────────────────── */
interface QuickStatCardProps {
    label: string;
    value: string;
    sub: string;
}

function QuickStatCard({ label, value, sub }: QuickStatCardProps) {
    return (
        <Card>
            <CardContent className="pt-5 pb-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">{label}</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
        </Card>
    );
}

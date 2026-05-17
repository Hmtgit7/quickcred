"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/common/Skeleton";
import { useProfile } from "@/modules/users/hooks/useProfile";
import {
    updateProfileSchema,
    type UpdateProfileFormData,
} from "@/modules/users/types/user.schemas";
import { EmploymentMode, Role } from "@/types/enums";
import { formatCurrency } from "@/lib/utils";
import { StaffProfileCard } from "./StaffProfileCard";

const EMPLOYMENT_OPTIONS = [
    { value: EmploymentMode.Salaried, label: "Salaried" },
    { value: EmploymentMode.SelfEmployed, label: "Self-Employed" },
    { value: EmploymentMode.Unemployed, label: "Unemployed" },
];

export function ProfileCard() {
    const { user, isLoading, updateProfile, isUpdating, serverBREErrors } = useProfile();

    const form = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema as never),
        values: {
            fullName: user?.fullName ?? "",
            pan: user?.pan ?? "",
            dob: user?.dob ? user.dob.slice(0, 10) : "",
            monthlySalary: user?.monthlySalary ?? 0,
            employmentMode: user?.employmentMode ?? EmploymentMode.Salaried,
        },
    });
    const monthlySalary = useWatch({
        control: form.control,
        name: "monthlySalary",
    }) ?? 0;

    const onSubmit = (data: UpdateProfileFormData) => {
        updateProfile(data);
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-1.5">
                            <Skeleton className="h-3.5 w-20" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (user && user.role !== Role.Borrower) {
        return <StaffProfileCard user={user} />;
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Personal Details</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                            Required for loan eligibility. All fields are verified.
                        </CardDescription>
                    </div>
                    {user?.profileCompleted ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1">
                            <BadgeCheck className="h-3 w-3" />
                            Verified
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                            <Clock className="h-3 w-3" />
                            Incomplete
                        </Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} disabled={isUpdating} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PAN number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ABCDE1234F"
                                            className="uppercase"
                                            maxLength={10}
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                            disabled={isUpdating}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of birth</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} disabled={isUpdating} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="monthlySalary"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly salary (₹)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="50000"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                disabled={isUpdating}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="employmentMode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Employment mode</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isUpdating}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select employment type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {EMPLOYMENT_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Salary preview */}
                        {monthlySalary > 0 && (
                            <div className="rounded-lg bg-muted/50 border border-border/60 px-4 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Monthly salary:{" "}
                                    <span className="font-semibold text-foreground tabular-nums">
                                        {formatCurrency(monthlySalary)}
                                    </span>
                                    {monthlySalary >= 25_000 ? (
                                        <span className="ml-2 text-green-600 dark:text-green-400">✓ Meets minimum</span>
                                    ) : (
                                        <span className="ml-2 text-destructive">✗ Below ₹25,000 minimum</span>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* Server-side BRE errors (from API response) */}
                        {serverBREErrors.length > 0 && (
                            <Alert variant="destructive">
                                <ShieldAlert className="h-4 w-4" />
                                <AlertDescription>
                                    <p className="font-medium mb-1">Eligibility check failed:</p>
                                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                                        {serverBREErrors.map((e) => (
                                            <li key={e}>{e}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button type="submit" className="w-full" disabled={isUpdating}>
                            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isUpdating ? "Saving…" : "Save profile"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

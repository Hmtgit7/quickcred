"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert } from "lucide-react";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useProfile } from "@/modules/users/hooks/useProfile";
import {
    updateProfileSchema,
    type UpdateProfileFormData,
} from "@/modules/users/types/user.schemas";
import { EmploymentMode } from "@/types/enums";
import { formatCurrency } from "@/lib/utils";
import { BRE_CONSTANTS } from "@/constants/app.constants";
import { calculateAge } from "@/lib/utils";

interface StepPersonalDetailsProps {
    onNext: () => void;
}

const EMPLOYMENT_OPTIONS = [
    { value: EmploymentMode.Salaried, label: "Salaried" },
    { value: EmploymentMode.SelfEmployed, label: "Self-Employed" },
    { value: EmploymentMode.Unemployed, label: "Unemployed (not eligible)" },
];

function getBREErrors(data: Partial<UpdateProfileFormData>): string[] {
    const errors: string[] = [];
    if (data.dob) {
        const age = calculateAge(data.dob);
        if (age < BRE_CONSTANTS.MIN_AGE || age > BRE_CONSTANTS.MAX_AGE) {
            errors.push(`Age must be between ${BRE_CONSTANTS.MIN_AGE} and ${BRE_CONSTANTS.MAX_AGE} years (yours: ${age})`);
        }
    }
    if (data.monthlySalary !== undefined && data.monthlySalary < BRE_CONSTANTS.MIN_MONTHLY_SALARY) {
        errors.push(`Monthly salary must be at least ${formatCurrency(BRE_CONSTANTS.MIN_MONTHLY_SALARY)}`);
    }
    if (data.employmentMode === EmploymentMode.Unemployed) {
        errors.push("Unemployed applicants are not eligible for a loan");
    }
    return errors;
}

export function StepPersonalDetails({ onNext }: StepPersonalDetailsProps) {
    const { user, updateProfile, isUpdating } = useProfile();

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

    const watched = useWatch({ control: form.control });
    const breErrors = getBREErrors(watched);
    const hasBreErrors = breErrors.length > 0;

    const onSubmit = (data: UpdateProfileFormData) => {
        if (hasBreErrors) return;
        updateProfile(data, {
            onSuccess: () => onNext(),
        });
    };

    return (
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
                            <Select onValueChange={field.onChange} value={field.value} disabled={isUpdating}>
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

                {/* BRE live feedback */}
                {hasBreErrors && (
                    <Alert variant="destructive">
                        <ShieldAlert className="h-4 w-4" />
                        <AlertDescription>
                            <p className="font-medium mb-1">Eligibility check failed:</p>
                            <ul className="list-disc list-inside space-y-0.5 text-xs">
                                {breErrors.map((e) => <li key={e}>{e}</li>)}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isUpdating || hasBreErrors}
                >
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isUpdating ? "Saving…" : "Save & Continue"}
                </Button>
            </form>
        </Form>
    );
}

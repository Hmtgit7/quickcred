"use client";

import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "./PasswordInput";
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormData } from "../types/auth.schemas";
import { ROUTES } from "@/constants/routes";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema as never),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  const onSubmit = (data: RegisterFormData) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    };
    register(payload, {
      onError: (error) => {
        toast.error(getAxiosErrorMessage(error, "Registration failed. Please try again."));
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Min 8 chars"
                  autoComplete="new-password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {/* Live strength checklist */}
              {password.length > 0 && (
                <PasswordStrength password={password} />
              )}
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Creating account…" : "Create account"}
        </Button>

        <Separator className="my-2" />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  );
}

/* ── Password strength checklist ────────────────────────────── */
interface PasswordStrengthProps {
  password: string;
}

const RULES = [
  { id: "length", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper",  label: "One uppercase letter",  test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",  label: "One lowercase letter",  test: (p: string) => /[a-z]/.test(p) },
  { id: "number", label: "One number",             test: (p: string) => /[0-9]/.test(p) },
  { id: "special",label: "One special character",  test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
] as const;

function PasswordStrength({ password }: PasswordStrengthProps) {
  const passed = RULES.filter((r) => r.test(password)).length;
  const strengthColor =
    passed <= 2 ? "bg-destructive" : passed <= 3 ? "bg-amber-500" : "bg-green-500";

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= passed ? strengthColor : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Checklist */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.id} className="flex items-center gap-1.5 text-xs">
              {ok ? (
                <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
              ) : (
                <XCircle className="h-3 w-3 text-muted-foreground shrink-0" />
              )}
              <span className={cn(ok ? "text-foreground" : "text-muted-foreground")}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

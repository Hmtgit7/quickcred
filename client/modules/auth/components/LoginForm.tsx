"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../types/auth.schemas";
import { ROUTES } from "@/constants/routes";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as never),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error) => {
        toast.error(getAxiosErrorMessage(error, "Invalid email or password"));
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
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
                  placeholder="••••••••"
                  autoComplete="current-password"
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
          {isPending ? "Signing in…" : "Sign in"}
        </Button>

        <Separator className="my-2" />

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Create account
          </Link>
        </p>

        {/* Demo credentials hint */}
        <DemoCredentials onFill={(email, password) => {
          form.reset({ email, password });
        }} />
      </form>
    </Form>
  );
}

/* ── Demo credentials helper ─────────────────────────────────── */
interface DemoCredentialsProps {
  onFill: (email: string, password: string) => void;
}

const DEMO_ROLES = [
  { label: "Admin", email: "admin@quickcred.com", password: "Admin@123" },
  { label: "Sales", email: "sales@quickcred.com", password: "Sales@123" },
  { label: "Sanction", email: "sanction@quickcred.com", password: "Sanction@123" },
  { label: "Disburse", email: "disburse@quickcred.com", password: "Disburse@123" },
  { label: "Collection", email: "collection@quickcred.com", password: "Collect@123" },
  { label: "Borrower", email: "borrower@quickcred.com", password: "Borrow@123" },
] as const;

function DemoCredentials({ onFill }: DemoCredentialsProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/40 p-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Demo accounts
      </p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {DEMO_ROLES.map(({ label, email, password }) => (
          <button
            key={label}
            type="button"
            onClick={() => onFill(email, password)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <span className="block font-medium">{label}</span>
            <span className="block truncate text-muted-foreground">{email}</span>
            <span className="block font-mono text-[11px] text-muted-foreground">{password}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

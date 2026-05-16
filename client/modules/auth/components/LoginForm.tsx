"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import { DemoCredentials } from "./DemoCredentials";
import { PasswordInput } from "./PasswordInput";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../types/auth.schemas";

export function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema as never),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error) => toast.error(getAxiosErrorMessage(error, "Invalid email or password")),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email address</FormLabel>
            <FormControl>
              <Input type="email" placeholder="you@example.com" autoComplete="email" className="h-12 px-4" disabled={isPending} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <PasswordInput placeholder="Enter your password" autoComplete="current-password" className="h-12 px-4" disabled={isPending} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.REGISTER} className="font-semibold text-primary hover:underline">
            Create account
          </Link>
        </p>

        <DemoCredentials onFill={(email, password) => form.reset({ email, password })} />
      </form>
    </Form>
  );
}

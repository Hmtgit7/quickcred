"use client";

import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { getAxiosErrorMessage } from "@/lib/axios/errorUtils";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrength } from "./PasswordStrength";
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormData } from "../types/auth.schemas";

export function RegisterForm() {
  const { mutate: register, isPending } = useRegister();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema as never),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
    mode: "onChange",
  });
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  const onSubmit = (data: RegisterFormData) => {
    register({ fullName: data.fullName, email: data.email, password: data.password }, {
      onError: (error) => toast.error(getAxiosErrorMessage(error, "Registration failed. Please try again.")),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormField control={form.control} name="fullName" render={({ field }) => (
          <FormItem>
            <FormLabel>Full name</FormLabel>
            <FormControl><Input placeholder="John Doe" autoComplete="name" className="h-12 px-4" disabled={isPending} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email address</FormLabel>
            <FormControl><Input type="email" placeholder="you@example.com" autoComplete="email" className="h-12 px-4" disabled={isPending} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><PasswordInput placeholder="Min 8 chars" autoComplete="new-password" className="h-12 px-4" disabled={isPending} {...field} /></FormControl>
            <FormMessage />
            {password.length > 0 && <PasswordStrength password={password} />}
          </FormItem>
        )} />

        <FormField control={form.control} name="confirmPassword" render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm password</FormLabel>
            <FormControl><PasswordInput placeholder="Repeat your password" autoComplete="new-password" className="h-12 px-4" disabled={isPending} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </Form>
  );
}

import { type ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthHeader } from "./AuthHeader";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <AuthHeader />
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
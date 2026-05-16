import { type ReactNode } from "react";
import { AuthHeader } from "./AuthHeader";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="flex w-full max-w-md flex-1 flex-col justify-center py-10">
      <AuthHeader />
      <div className="mt-14">
        <h1 className="text-4xl font-semibold leading-tight tracking-normal text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
      </div>
      <div className="mt-9">{children}</div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full w-10 text-muted-foreground hover:text-foreground hover:bg-transparent"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {show ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
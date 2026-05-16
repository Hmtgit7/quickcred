import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/constants/app.constants";
import { ROUTES } from "@/constants/routes";

export function AuthHeader() {
  return (
    <Link href={ROUTES.HOME} className="flex w-fit items-center gap-3" aria-label={APP_NAME}>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className="text-2xl font-semibold tracking-normal text-foreground">{APP_NAME}</span>
    </Link>
  );
}

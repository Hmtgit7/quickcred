import Link from "next/link";
import { APP_NAME } from "@/constants/app.constants";

export function AuthHeader() {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      {/* Logo mark */}
      <Link href="/" className="flex items-center gap-2.5 group" aria-label={APP_NAME}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm transition-transform group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M12 2L4 7v5c0 5 4 9.5 8 11 4-1.5 8-6 8-11V7L12 2z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          {APP_NAME}
        </span>
      </Link>

      {/* Tagline */}
      <p className="text-xs text-muted-foreground">
        Transparent lending, simplified.
      </p>
    </div>
  );
}
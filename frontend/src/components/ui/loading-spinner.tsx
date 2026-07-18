import { cn } from "@/lib/cn";

interface LoadingSpinnerProps {
  className?: string;
  /** Screen-reader announcement, e.g. "Loading products". */
  label?: string;
}

export function LoadingSpinner({ className, label }: LoadingSpinnerProps) {
  return (
    <span className="inline-flex items-center" role={label ? "status" : undefined}>
      <svg
        className={cn("animate-spin", className ?? "h-5 w-5")}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

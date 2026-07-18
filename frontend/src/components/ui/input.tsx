import { cn } from "@/lib/cn";

const fieldClasses = (invalid: boolean | undefined, className?: string) =>
  cn(
    "w-full rounded-lg border bg-surface px-3.5 text-base text-ink transition-colors placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
    invalid ? "border-error" : "border-line",
    className,
  );

type InputProps = React.ComponentProps<"input"> & {
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      className={cn("h-11", fieldClasses(invalid, className))}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type TextareaProps = React.ComponentProps<"textarea"> & {
  invalid?: boolean;
};

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn("py-2.5", fieldClasses(invalid, className))}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

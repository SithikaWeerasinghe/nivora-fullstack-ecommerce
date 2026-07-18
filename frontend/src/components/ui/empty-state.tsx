interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  /** Heading level — use "h1" when the state is the page's main content. */
  as?: "h1" | "h2";
  children?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  message,
  as: Heading = "h2",
  children,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center rounded-xl border border-line bg-surface px-6 py-12 text-center">
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-canvas text-muted">
          {icon}
        </div>
      ) : null}
      <Heading className="text-lg font-semibold text-ink">{title}</Heading>
      <p className="mt-1.5 text-sm text-muted">{message}</p>
      {children ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
      ) : null}
    </div>
  );
}

"use client";

import { useId, useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface QuantitySelectorProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}

const stepButtonClasses =
  "flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center text-ink transition-colors hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

/**
 * Quantity control clamped to [min, max]. While the field is focused the
 * user edits a local draft (digits only); the draft is validated and
 * committed on blur or Enter, so the value can never be zero, negative,
 * or above the available stock.
 */
export function QuantitySelector({
  value,
  max,
  min = 1,
  onChange,
  disabled = false,
  label = "Quantity",
}: QuantitySelectorProps) {
  const inputId = useId();
  // null = not editing; the displayed value then always follows `value`.
  const [draft, setDraft] = useState<string | null>(null);
  const displayValue = draft ?? String(value);

  function clamp(candidate: number): number {
    return Math.min(Math.max(min, candidate), Math.max(min, max));
  }

  function commitDraft() {
    if (draft === null) return;
    const parsed = Number.parseInt(draft, 10);
    const next = clamp(Number.isNaN(parsed) ? min : parsed);
    setDraft(null);
    if (next !== value) onChange(next);
  }

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-line bg-surface">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className={stepButtonClasses}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <input
        id={inputId}
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        disabled={disabled}
        onFocus={() => setDraft(String(value))}
        onChange={(event) =>
          setDraft(event.target.value.replace(/[^0-9]/g, ""))
        }
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitDraft();
          }
        }}
        className="h-11 w-14 border-x border-line bg-surface text-center text-sm font-medium text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className={stepButtonClasses}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

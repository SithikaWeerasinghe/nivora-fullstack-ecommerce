"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared open/close behaviour for small navigation popovers.
 * Escape closes and returns focus to the trigger; pointer-down
 * outside the container closes without stealing the interaction.
 */
export function useDismissableMenu<
  TContainer extends HTMLElement,
  TTrigger extends HTMLElement,
>() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<TContainer | null>(null);
  const triggerRef = useRef<TTrigger | null>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (target && containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return { open, close, toggle, containerRef, triggerRef };
}

"use client";
import { useSyncExternalStore } from "react";

let hasFirstPaintCompleted = false;
let paintScheduled = false;
const firstPaintListeners = new Set<() => void>();

function scheduleFirstPaintFlip() {
  if (
    paintScheduled ||
    hasFirstPaintCompleted ||
    typeof window === "undefined"
  ) {
    return;
  }

  paintScheduled = true;
  window.requestAnimationFrame(() => {
    hasFirstPaintCompleted = true;
    paintScheduled = false;
    firstPaintListeners.forEach((listener) => listener());
  });
}

function subscribeToFirstPaint(listener: () => void) {
  firstPaintListeners.add(listener);
  scheduleFirstPaintFlip();
  return () => {
    firstPaintListeners.delete(listener);
  };
}

/**
 * Returns true during the first client paint (hydration guard),
 * then flips to false after mount.
 */
export function useFirstPaint(): boolean {
  scheduleFirstPaintFlip();
  return useSyncExternalStore(
    subscribeToFirstPaint,
    () => !hasFirstPaintCompleted,
    () => true,
  );
}

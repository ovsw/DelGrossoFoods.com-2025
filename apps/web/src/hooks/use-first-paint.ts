"use client";
import { useEffect, useState } from "react";

/**
 * Returns true during the first client paint (hydration guard),
 * then flips to false after mount.
 */
export function useFirstPaint(): boolean {
  const [firstPaint, setFirstPaint] = useState(true);
  useEffect(() => setFirstPaint(false), []);
  return firstPaint;
}

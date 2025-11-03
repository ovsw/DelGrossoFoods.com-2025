"use client";

import { VisualEditing } from "next-sanity";
import { useIsPresentationTool } from "next-sanity/hooks";

export function PresentationVisualEditing() {
  const isPresentation = useIsPresentationTool();
  const hasPreviewCookie =
    typeof document !== "undefined" &&
    (document.cookie.includes("__next_preview_data=") ||
      document.cookie.includes("__prerender_bypass="));

  if (!isPresentation && !hasPreviewCookie) return null;
  return <VisualEditing />;
}

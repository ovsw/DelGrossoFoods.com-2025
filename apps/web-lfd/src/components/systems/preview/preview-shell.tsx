"use client";
import { VisualEditing } from "next-sanity/visual-editing";
import { useEffect, useState } from "react";

import { PreviewBar } from "@/components/systems/preview/preview-bar";

export function PreviewShell() {
  const [isDraftMode, setIsDraftMode] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDraftModeStatus() {
      try {
        // Keep draft-mode detection out of the root layout so public HTML stays cacheable.
        const response = await fetch("/api/draft-status", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          setIsDraftMode(false);
          return;
        }

        const data = (await response.json()) as { isEnabled?: boolean };
        setIsDraftMode(Boolean(data.isEnabled));
      } catch {
        if (!controller.signal.aborted) {
          setIsDraftMode(false);
        }
      }
    }

    void loadDraftModeStatus();

    return () => controller.abort();
  }, []);

  if (!isDraftMode) {
    return null;
  }

  return (
    <>
      <PreviewBar />
      <VisualEditing />
    </>
  );
}

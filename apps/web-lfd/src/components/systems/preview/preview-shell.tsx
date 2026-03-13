import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { PreviewBar } from "@/components/systems/preview/preview-bar";

export async function PreviewShell() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <PreviewBar />
      <VisualEditing />
    </>
  );
}

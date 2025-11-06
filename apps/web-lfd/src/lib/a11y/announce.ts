export type Politeness = "polite" | "assertive";

export const A11Y_ANNOUNCE_EVENT = "a11y:announce" as const;

export interface AnnouncementDetail {
  readonly message: string;
  readonly politeness?: Politeness;
}

/**
 * Dispatch a global accessibility announcement handled by A11yLiveAnnouncer.
 * Prefer politeness: "polite"; reserve "assertive" for errors.
 */
export function announce(
  message: string,
  politeness: Politeness = "polite",
): void {
  if (!message) return;
  try {
    if (typeof document === "undefined") return;
    const detail: AnnouncementDetail = { message, politeness };
    document.dispatchEvent(
      new CustomEvent<AnnouncementDetail>(A11Y_ANNOUNCE_EVENT, { detail }),
    );
  } catch {
    // no-op in non-browser contexts
  }
}

import type {
  SectionSpacingToken,
  SectionSpacingTopToken,
} from "@workspace/ui/components/section";
import { stegaClean } from "next-sanity";

import type { SectionSpacing } from "@/lib/sanity/sanity.types";

interface ResolvedSectionSpacing {
  readonly spacingTop: SectionSpacingTopToken;
  readonly spacingBottom: SectionSpacingToken;
}

const SECTION_SPACING_VALUES = new Set<SectionSpacingToken>([
  "default",
  "none",
  "small",
  "large",
]);

function normalizeSpacingToken(value?: string | null): SectionSpacingToken {
  if (!value) {
    return "default";
  }

  const cleanedRaw = stegaClean(value);
  const cleaned =
    typeof cleanedRaw === "string"
      ? cleanedRaw.trim()
      : String(cleanedRaw).trim();

  if (!cleaned) {
    return "default";
  }

  if (SECTION_SPACING_VALUES.has(cleaned as SectionSpacingToken)) {
    return cleaned as SectionSpacingToken;
  }

  return "default";
}

export function resolveSectionSpacing(
  spacing?: SectionSpacing | null,
): ResolvedSectionSpacing {
  return {
    spacingTop: normalizeSpacingToken(spacing?.spacingTop),
    spacingBottom: normalizeSpacingToken(spacing?.spacingBottom),
  };
}

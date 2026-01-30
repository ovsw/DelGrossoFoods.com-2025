import type { PageBuilderBlockProps } from "../types";

/**
 * Placeholder for the homeSlideshowVertical block on the DGF site.
 * The content model exists for LFD, but the DGF site doesn't render it.
 * Returning null keeps the page stable while satisfying type coverage.
 */
export function HomeSlideshowVerticalBlock(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: PageBuilderBlockProps<"homeSlideshowVertical">,
) {
  return null;
}

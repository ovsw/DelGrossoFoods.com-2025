"use client";
import { Badge, type BadgeVariant } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { Filter } from "lucide-react";
import React from "react";

type FiltersRenderer = (args: {
  idPrefix: string;
  applyButton?: React.ReactNode;
}) => React.ReactNode;

type Props = {
  filters: FiltersRenderer;
  resultsText: string;
  sortControl: React.ReactNode;
  children: React.ReactNode;
  resultsAnchorId?: string;
  // When this key changes, layout scrolls to the results anchor
  scrollToTopKey?: unknown;
  // Skip scrolling when true (e.g., first render)
  skipScroll?: boolean;
  // Debounce for scroll to top
  scrollDebounceMs?: number;
  // Active filter chips rendered above the grid (desktop) and under the Filters button (mobile)
  activeChips?: Array<{
    key: string;
    text: string;
    variant?: BadgeVariant;
    onRemove?: () => void;
  }>;
};

export function FilterableListLayout({
  filters,
  resultsText,
  sortControl,
  children,
  resultsAnchorId = "results-top",
  scrollToTopKey,
  skipScroll = false,
  scrollDebounceMs = 200,
  activeChips = [],
}: Props) {
  // Debounced scroll-to-top when the provided key changes
  const prevKeyRef = React.useRef<unknown>(undefined);
  React.useEffect(() => {
    // Prime the previous key on first render or when skipping scroll
    if (prevKeyRef.current === undefined || skipScroll) {
      prevKeyRef.current = scrollToTopKey;
      return;
    }
    // Only act when the key actually changes
    if (Object.is(prevKeyRef.current, scrollToTopKey)) return;
    prevKeyRef.current = scrollToTopKey;

    const id = setTimeout(() => {
      const el = document.getElementById(resultsAnchorId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, scrollDebounceMs);
    return () => clearTimeout(id);
  }, [scrollToTopKey, skipScroll, resultsAnchorId, scrollDebounceMs]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-32 space-y-6">
          {filters({ idPrefix: "desktop" })}
        </div>
      </aside>

      {/* Main content */}
      <section className="min-w-0">
        {/* Top bar */}
        <div className="mb-8 md:mb-6 flex items-center gap-2">
          {/* Mobile filter button first on the left */}
          <div className="lg:hidden">
            <Drawer>
              <DrawerTrigger asChild>
                <Button type="button" variant="secondary">
                  <Filter className="me-2 size-4" aria-hidden="true" />
                  Filters
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filters</DrawerTitle>
                </DrawerHeader>
                <div className="mt-2 overflow-y-auto px-4 pb-24">
                  {filters({
                    idPrefix: "sheet",
                    applyButton: (
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button type="button">Apply</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    ),
                  })}
                </div>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Desktop chips inline with Sort on the right; fills available space */}
          {activeChips.length > 0 ? (
            <div className="hidden lg:flex flex-wrap gap-2 ms-2 flex-1">
              {activeChips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={c.onRemove}
                  aria-label={`Remove filter ${c.text}`}
                  className="cursor-pointer"
                >
                  <Badge text={`${c.text} ×`} variant={c.variant} />
                </button>
              ))}
            </div>
          ) : (
            <div className="hidden lg:block flex-1" />
          )}

          {/* Mobile chips are rendered below the toolbar (see below) */}

          {/* Sort dropdown on the right */}
          {sortControl}
        </div>

        {/* Anchor at top of results for scroll-to-top on filter changes */}
        <div id={resultsAnchorId} aria-hidden="true" />

        {/* Mobile active chips below toolbar: single accent color */}
        {activeChips.length > 0 ? (
          <div className="lg:hidden flex flex-wrap gap-2 mb-4">
            {activeChips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={c.onRemove}
                aria-label={`Remove filter ${c.text}`}
                className="cursor-pointer"
              >
                <Badge text={`${c.text} ×`} variant="accent" />
              </button>
            ))}
          </div>
        ) : null}

        {/* Desktop chips now inline with toolbar */}

        {/* Grid */}
        {children}
      </section>
    </div>
  );
}

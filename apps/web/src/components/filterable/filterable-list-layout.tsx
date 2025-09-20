"use client";
import { Badge, type BadgeVariant } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@workspace/ui/components/drawer";
import { Filter } from "lucide-react";
import React from "react";

import { ClearSection } from "@/components/filterable/clear-section";

type FiltersRenderer = (args: { idPrefix: string }) => React.ReactNode;

type Props = {
  renderFilters: FiltersRenderer;
  resultsCount: number;
  resultsTotal: number;
  isAnyActive: boolean;
  onClearAll: () => void;
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
  renderFilters,
  resultsCount,
  resultsTotal,
  isAnyActive,
  onClearAll,
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

  const resultsSummary = `Showing ${resultsCount} out of ${resultsTotal}`;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-32">
          <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-hidden pe-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Filters</h2>
                <ClearSection
                  label="Clear all"
                  show={isAnyActive}
                  onClear={onClearAll}
                />
              </div>
              <div
                aria-live="polite"
                aria-atomic="true"
                className="text-sm text-muted-foreground"
              >
                {resultsSummary}
              </div>
              <div className="border-b border-input" />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto pt-4 filter-scroll-area">
              <div className="pe-2 pb-8">
                {renderFilters({ idPrefix: "desktop" })}
              </div>
            </div>
          </div>
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
                <DrawerHeader className="pe-12">
                  <div className="flex items-center justify-between">
                    <DrawerTitle>Filters</DrawerTitle>
                    <ClearSection
                      label="Clear all"
                      show={isAnyActive}
                      onClear={onClearAll}
                    />
                  </div>
                  <div
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-2 text-xs text-muted-foreground"
                  >
                    {resultsSummary}
                  </div>
                </DrawerHeader>
                <div className="mt-2 overflow-y-auto px-4 pb-10">
                  {renderFilters({ idPrefix: "sheet" })}
                  <div className="mt-6 flex items-center justify-between gap-2 pb-6">
                    <ClearSection
                      label="Clear all"
                      show={isAnyActive}
                      onClear={onClearAll}
                    />
                    <DrawerClose asChild>
                      <Button type="button">Apply</Button>
                    </DrawerClose>
                  </div>
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

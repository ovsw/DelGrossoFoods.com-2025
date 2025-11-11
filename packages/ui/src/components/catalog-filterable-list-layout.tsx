"use client";
import { Filter } from "lucide-react";
import React from "react";

import { Badge, type BadgeVariant } from "./badge";
import { Button } from "./button";
import { ClearSection } from "./clear-section";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

type FiltersRenderer = (args: { idPrefix: string }) => React.ReactNode;

type ActiveChip = {
  key: string;
  text: string;
  variant?: BadgeVariant;
  onRemove?: () => void;
};

type Props = {
  renderFilters: FiltersRenderer;
  resultsCount: number;
  resultsTotal: number;
  isAnyActive: boolean;
  onClearAll: () => void;
  sortControl: React.ReactNode;
  children: React.ReactNode;
  resultsAnchorId?: string;
  scrollToTopKey?: unknown;
  skipScroll?: boolean;
  scrollDebounceMs?: number;
  activeChips?: ActiveChip[];
  rootProps?: React.HTMLAttributes<HTMLDivElement>;
};

export function CatalogFilterableListLayout({
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
  rootProps,
}: Props) {
  const prevKeyRef = React.useRef<unknown>(undefined);
  React.useEffect(() => {
    if (prevKeyRef.current === undefined || skipScroll) {
      prevKeyRef.current = scrollToTopKey;
      return;
    }
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
    <div
      className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8"
      {...rootProps}
    >
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

      <section className="min-w-0">
        <div className="mb-8 md:mb-6 flex items-center gap-2">
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

          {activeChips.length > 0 ? (
            <div className="hidden lg:flex flex-wrap gap-2 ms-2 flex-1">
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove filter ${chip.text}`}
                  className="cursor-pointer"
                >
                  <Badge text={`${chip.text} ×`} variant={chip.variant} />
                </button>
              ))}
            </div>
          ) : (
            <div className="hidden lg:block flex-1" />
          )}

          {sortControl}
        </div>

        <div id={resultsAnchorId} aria-hidden="true" />

        {activeChips.length > 0 ? (
          <div className="lg:hidden flex flex-wrap gap-2 mb-4">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove filter ${chip.text}`}
                className="cursor-pointer"
              >
                <Badge text={`${chip.text} ×`} variant="accent" />
              </button>
            ))}
          </div>
        ) : null}

        {children}
      </section>
    </div>
  );
}

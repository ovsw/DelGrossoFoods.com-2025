"use client";
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

type FiltersRenderer = (args: {
  idPrefix: string;
  applyButton?: React.ReactNode;
}) => React.ReactNode;

type Props = {
  filters: FiltersRenderer;
  resultsText: string;
  sortControl: React.ReactNode;
  children: React.ReactNode;
};

export function FilterableListLayout({
  filters,
  resultsText,
  sortControl,
  children,
}: Props) {
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
        <div className="mb-8 md:mb-12 flex items-center gap-2">
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

          {/* Live results text */}
          <div
            aria-live="polite"
            aria-atomic="true"
            className="flex-1 text-muted-foreground"
          >
            {resultsText}
          </div>

          {/* Sort dropdown on the right */}
          {sortControl}
        </div>

        {/* Grid */}
        {children}
      </section>
    </div>
  );
}

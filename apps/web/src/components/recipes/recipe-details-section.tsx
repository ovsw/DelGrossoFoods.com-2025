"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Section } from "@workspace/ui/components/section";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import LogoSvg from "@/components/elements/logo";
import { RichText } from "@/components/elements/rich-text";
import {
  meatMap,
  tagMap,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import { announce } from "@/lib/a11y/announce";
import type { RecipeDetailData } from "@/types";

type VariantKey = "original" | "premium";

function hasBlocks(blocks: unknown[] | null | undefined): boolean {
  return Array.isArray(blocks) && blocks.length > 0;
}

function useVariantState(available: VariantKey[]) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const rawParam = search.get("line");
  const param: VariantKey | null = React.useMemo(() => {
    if (!rawParam) return null;
    const normalized = rawParam.replace(/\s+/g, "").toLowerCase();
    if (normalized === "original") return "original";
    if (normalized === "lafamigliadelgrosso") return "premium";
    return null;
  }, [rawParam]);
  const defaultValue = React.useMemo<VariantKey>(() => {
    if (param && available.includes(param)) return param;
    return available[0]!;
  }, [param, available]);
  const [value, setValue] = React.useState<VariantKey>(defaultValue);
  React.useEffect(() => {
    // sync external param changes (e.g., back/forward nav)
    if (param && available.includes(param) && param !== value) setValue(param);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  const setAndSync = React.useCallback(
    (next: VariantKey) => {
      setValue(next);
      const sp = new URLSearchParams(search.toString());
      sp.set("line", next === "premium" ? "LaFamiliaDelGrosso" : "original");
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
      const label =
        next === "premium" ? "La Famiglia version" : "Original version";
      announce(`Switched to ${label}.`);
    },
    [pathname, router, search],
  );
  return [value, setAndSync] as const;
}

function BrandTabLabel({ variant }: { variant: VariantKey }) {
  if (variant === "premium") {
    return (
      <span className="inline-flex flex-col items-start gap-1 text-start leading-tight">
        <span className="relative block h-6 w-[112px] overflow-hidden">
          <Image
            src="/images/logos/lfd-logo-light-short-p-500.png"
            alt=""
            fill
            sizes="140px"
            className="object-contain object-left"
            priority={false}
          />
        </span>
        <span aria-hidden className="text-sm">
          La Famiglia DelGrosso
        </span>
      </span>
    );
  }
  return (
    <span className="inline-flex flex-col items-start gap-1 text-start leading-tight">
      <LogoSvg className="h-6 w-auto self-start" aria-hidden />
      <span aria-hidden className="text-sm">
        DelGrosso Original
      </span>
    </span>
  );
}

function InfoRow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-th-dark-700">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export interface RecipeDetailsSectionProps {
  readonly recipe: RecipeDetailData;
}

export function RecipeDetailsSection({ recipe }: RecipeDetailsSectionProps) {
  const hasOriginal =
    hasBlocks(recipe.dgfIngredients) ||
    hasBlocks(recipe.dgfDirections) ||
    hasBlocks(recipe.dgfNotes) ||
    (recipe.dgfSauces?.length ?? 0) > 0;
  const hasPremium =
    hasBlocks(recipe.lfdIngredients) ||
    hasBlocks(recipe.lfdDirections) ||
    hasBlocks(recipe.lfdNotes) ||
    (recipe.lfdSauces?.length ?? 0) > 0;

  const available: VariantKey[] =
    hasOriginal && hasPremium
      ? ["original", "premium"]
      : hasOriginal
        ? ["original"]
        : ["premium"];

  const [variant, setVariant] = useVariantState(available);

  const meatBadges = (recipe.meat ?? [])
    .map((value) => {
      const slugValue = toMeatSlug(value);
      if (!slugValue) return null;
      const cfg = meatMap[slugValue];
      return (
        <Badge
          key={`${cfg.display}-${String(value)}`}
          text={cfg.display}
          variant="meat"
        />
      );
    })
    .filter(Boolean);

  const tagBadges = (recipe.tags ?? [])
    .map((value) => {
      const slugValue = toRecipeTagSlug(value);
      if (!slugValue) return null;
      const cfg = tagMap[slugValue];
      return (
        <Badge
          key={`${cfg.display}-${String(value)}`}
          text={cfg.display}
          variant={cfg.badgeVariant}
        />
      );
    })
    .filter(Boolean);

  const categoryBadges = (recipe.categories ?? [])
    .map((cat) =>
      cat?.title ? (
        <Badge key={cat._id} text={cat.title} variant="outline" />
      ) : null,
    )
    .filter(Boolean);

  const dgfSauceBadges = (recipe.dgfSauces ?? [])
    .map((s) =>
      s?.slug ? (
        <Badge
          key={s._id}
          text={s.name ?? "Sauce"}
          variant="original"
          href={`/sauces/${s.slug}`}
          aria-label={`View ${s.name ?? "sauce"} (Original line)`}
        />
      ) : null,
    )
    .filter(Boolean);

  const lfdSauceBadges = (recipe.lfdSauces ?? [])
    .map((s) =>
      s?.slug ? (
        <Badge
          key={s._id}
          text={s.name ?? "Sauce"}
          variant="premium"
          href={`/sauces/${s.slug}`}
          aria-label={`View ${s.name ?? "sauce"} (La Famiglia line)`}
        />
      ) : null,
    )
    .filter(Boolean);

  // We intentionally preserve stega metadata in visible rich text below.

  const baseTriggerClasses =
    "cursor-pointer rounded-none rounded-b-none border px-4 py-3 text-base font-medium transition-all opacity-80 hover:opacity-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-selected:opacity-100 aria-selected:py-4";

  return (
    <Section spacingTop="default" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left: Variant content */}
          <div className="order-2 md:order-1 md:col-span-7 lg:col-span-8">
            {available.length > 1 ? (
              <Tabs
                value={variant}
                onValueChange={(v) => setVariant(v as VariantKey)}
                className="w-full"
              >
                <TabsList className="flex items-end gap-0 -mb-px min-h-24">
                  <TabsTrigger
                    value="original"
                    className={cn(
                      baseTriggerClasses,
                      "rounded-tl-sm border-brand-green/80 bg-brand-green/90 text-brand-green-text hover:bg-brand-green aria-selected:border-brand-green aria-selected:bg-brand-green aria-selected:text-brand-green-text aria-selected:rounded-tr-sm",
                    )}
                  >
                    <BrandTabLabel variant="original" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="premium"
                    className={cn(
                      baseTriggerClasses,
                      "rounded-tr-sm border-l-0 border-th-dark-900/80 bg-th-dark-900/90 text-th-light-100 hover:bg-th-dark-900 aria-selected:border-th-dark-900 aria-selected:bg-th-dark-900 aria-selected:text-th-light-100 aria-selected:rounded-tl-sm",
                    )}
                  >
                    <BrandTabLabel variant="premium" />
                  </TabsTrigger>
                </TabsList>
                <div className="space-y-10">
                  <TabsContent
                    value="original"
                    lazyMount
                    className="rounded-md bg-th-light-100 p-6"
                  >
                    <VariantContent
                      ingredients={recipe.dgfIngredients}
                      directions={recipe.dgfDirections}
                      notes={recipe.dgfNotes}
                    />
                  </TabsContent>
                  <TabsContent
                    value="premium"
                    lazyMount
                    className="rounded-md bg-th-light-100 p-6"
                  >
                    <VariantContent
                      ingredients={recipe.lfdIngredients}
                      directions={recipe.lfdDirections}
                      notes={recipe.lfdNotes}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="rounded-md bg-th-light-100 p-6">
                <VariantContent
                  ingredients={
                    available[0] === "premium"
                      ? recipe.lfdIngredients
                      : recipe.dgfIngredients
                  }
                  directions={
                    available[0] === "premium"
                      ? recipe.lfdDirections
                      : recipe.dgfDirections
                  }
                  notes={
                    available[0] === "premium"
                      ? recipe.lfdNotes
                      : recipe.dgfNotes
                  }
                />
              </div>
            )}
          </div>

          {/* Right: Info panel */}
          <aside className="order-1 md:order-2 md:col-span-5 lg:col-span-4 md:self-start md:sticky md:top-36">
            <div className="md:max-h-[calc(100vh-6rem)] md:overflow-y-auto md:pr-2">
              <h3 className="text-lg font-semibold">Recipe Info</h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {recipe.serves ? (
                  <div>
                    <div className="text-sm font-medium text-th-dark-700">
                      Serves
                    </div>
                    <div className="mt-1">{recipe.serves}</div>
                  </div>
                ) : null}

                {meatBadges.length > 0 ? (
                  <InfoRow title="Meat">{meatBadges}</InfoRow>
                ) : null}

                {categoryBadges.length > 0 ? (
                  <InfoRow title="Categories">{categoryBadges}</InfoRow>
                ) : null}

                {tagBadges.length > 0 ? (
                  <InfoRow title="Tags">{tagBadges}</InfoRow>
                ) : null}

                {(dgfSauceBadges.length > 0 || lfdSauceBadges.length > 0) && (
                  <div className="space-y-4 md:col-span-2">
                    <div className="text-sm font-medium text-th-dark-700">
                      Sauces
                    </div>
                    {dgfSauceBadges.length > 0 ? (
                      <div>
                        <div className="text-xs text-th-dark-600">
                          DelGrosso Original Sauces:
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {dgfSauceBadges}
                        </div>
                      </div>
                    ) : null}
                    {lfdSauceBadges.length > 0 ? (
                      <div>
                        <div className="text-xs text-th-dark-600">
                          La Famiglia DelGrosso sauces:
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {lfdSauceBadges}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}

function VariantContent({
  ingredients,
  directions,
  notes,
}: {
  ingredients?: unknown[] | null;
  directions?: unknown[] | null;
  notes?: unknown[] | null;
}) {
  return (
    <div className="space-y-10">
      {/* Ingredients */}
      {hasBlocks(ingredients) ? (
        <section
          id="ingredients"
          className="space-y-4"
          aria-labelledby="ingredients-heading"
        >
          <h2
            id="ingredients-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
          >
            Ingredients
          </h2>
          <RichText richText={ingredients} className="mt-0" />
        </section>
      ) : null}

      {/* Directions */}
      {hasBlocks(directions) ? (
        <section
          id="directions"
          className="space-y-4"
          aria-labelledby="directions-heading"
        >
          <h2
            id="directions-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
          >
            Directions
          </h2>
          <RichText richText={directions} className="mt-0" />
        </section>
      ) : null}

      {/* Notes */}
      {hasBlocks(notes) ? (
        <section
          id="notes"
          className="space-y-4"
          aria-labelledby="notes-heading"
        >
          <h2
            id="notes-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
          >
            Notes
          </h2>
          <RichText richText={notes} className="mt-0" />
        </section>
      ) : null}
    </div>
  );
}

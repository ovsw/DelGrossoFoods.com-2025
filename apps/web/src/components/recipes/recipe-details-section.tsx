"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Section } from "@workspace/ui/components/section";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
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
      <span className="inline-flex items-center gap-2">
        <span className="relative block h-5 w-[76px] overflow-hidden">
          <Image
            src="/images/logos/lfd-logo-light-short-p-500.png"
            alt="La Famiglia DelGrosso"
            fill
            sizes="96px"
            className="object-contain"
            priority={false}
          />
        </span>
        <span className="sr-only">La Famiglia</span>
        <span aria-hidden>La Famiglia</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <LogoSvg className="h-5 w-auto" aria-hidden />
      <span className="sr-only">Original</span>
      <span aria-hidden>Original</span>
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

  return (
    <Section spacingTop="default" spacingBottom="large">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_320px]">
          {/* Left: Variant content */}
          <div>
            {available.length > 1 ? (
              <Tabs
                value={variant}
                onValueChange={(v) => setVariant(v as VariantKey)}
                className="w-full"
              >
                <TabsList className="flex items-center gap-2">
                  <TabsTrigger value="original">
                    <BrandTabLabel variant="original" />
                  </TabsTrigger>
                  <TabsTrigger value="premium">
                    <BrandTabLabel variant="premium" />
                  </TabsTrigger>
                </TabsList>
                <div className="mt-6 space-y-10">
                  <TabsContent value="original" lazyMount>
                    <VariantContent
                      ingredients={recipe.dgfIngredients}
                      directions={recipe.dgfDirections}
                      notes={recipe.dgfNotes}
                    />
                  </TabsContent>
                  <TabsContent value="premium" lazyMount>
                    <VariantContent
                      ingredients={recipe.lfdIngredients}
                      directions={recipe.lfdDirections}
                      notes={recipe.lfdNotes}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            ) : (
              <div className="space-y-10">
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
          <aside className="md:sticky md:top-24">
            <div className="rounded-lg border bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold">Recipe Info</h3>
              <div className="mt-4 grid gap-5">
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
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-th-dark-700">
                      Sauces
                    </div>
                    {dgfSauceBadges.length > 0 ? (
                      <div>
                        <div className="text-xs text-th-dark-600">Original</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {dgfSauceBadges}
                        </div>
                      </div>
                    ) : null}
                    {lfdSauceBadges.length > 0 ? (
                      <div>
                        <div className="text-xs text-th-dark-600">
                          La Famiglia
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
        <section id="ingredients">
          <h2 className="text-2xl font-semibold">Ingredients</h2>
          <RichText richText={ingredients} className="mt-4" />
        </section>
      ) : null}

      {/* Directions */}
      {hasBlocks(directions) ? (
        <section id="directions">
          <h2 className="text-2xl font-semibold">Directions</h2>
          <RichText richText={directions} className="mt-4" />
        </section>
      ) : null}

      {/* Notes */}
      {hasBlocks(notes) ? (
        <section id="notes">
          <h2 className="text-2xl font-semibold">Notes</h2>
          <RichText richText={notes} className="mt-4" />
        </section>
      ) : null}
    </div>
  );
}

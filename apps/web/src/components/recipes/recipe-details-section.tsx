"use client";
import { Badge } from "@workspace/ui/components/badge";
import { InfoLabel } from "@workspace/ui/components/info-label";
import { Section } from "@workspace/ui/components/section";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stegaClean } from "next-sanity";
import * as React from "react";

import LogoSvg from "@/components/elements/logo";
import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import {
  meatMap,
  tagMap,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import { announce } from "@/lib/a11y/announce";
import {
  DEFAULT_STATE,
  type RecipeQueryState,
  serializeStateToParams,
} from "@/lib/recipes/url";
import type {
  RecipeDetailData,
  SanityImageProps as SanityImageData,
} from "@/types";

type VariantKey = "original" | "premium";

type RecipeSauce = NonNullable<
  NonNullable<RecipeDetailData["dgfSauces"]>[number]
>;

type SauceDisplayItem = {
  id: string;
  name: string;
  href: string | null;
  image: SanityImageData | null;
  alt: string;
};

function buildRecipesFilterLink(partial: Partial<RecipeQueryState>): string {
  const params = serializeStateToParams({
    ...DEFAULT_STATE,
    ...partial,
  });
  const query = params.toString();
  return query ? `/recipes?${query}` : "/recipes";
}

function normalizeSauceHref(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const cleaned = slug.trim();
  if (!cleaned) return null;
  const withoutLeadingSlash = cleaned.replace(/^\/+/, "");
  const path = withoutLeadingSlash.startsWith("sauces/")
    ? withoutLeadingSlash
    : `sauces/${withoutLeadingSlash}`;
  return `/${path}`;
}

function toSanityImageData(
  image: RecipeSauce["mainImage"],
): SanityImageData | null {
  if (!image || typeof image !== "object") return null;
  const assetRef = image.asset?._ref;
  if (!assetRef || typeof assetRef !== "string") return null;

  const hotspot =
    image.hotspot &&
    typeof image.hotspot.x === "number" &&
    typeof image.hotspot.y === "number"
      ? { x: image.hotspot.x, y: image.hotspot.y }
      : null;

  const crop =
    image.crop &&
    typeof image.crop.top === "number" &&
    typeof image.crop.bottom === "number" &&
    typeof image.crop.left === "number" &&
    typeof image.crop.right === "number"
      ? {
          top: image.crop.top,
          bottom: image.crop.bottom,
          left: image.crop.left,
          right: image.crop.right,
        }
      : null;

  return {
    id: assetRef,
    preview: null,
    hotspot,
    crop,
  };
}

function mapSaucesToDisplay(
  sauces: RecipeDetailData["dgfSauces"],
): SauceDisplayItem[] {
  return (sauces ?? [])
    .map((sauce) => {
      if (!sauce) return null;

      const name = sauce.name ?? "Sauce";
      const cleanedName = stegaClean(name);
      const accessibleName =
        typeof cleanedName === "string" && cleanedName.trim().length > 0
          ? cleanedName.trim()
          : name;
      const rawAlt = sauce.mainImage?.alt;
      const cleanedAlt = rawAlt ? stegaClean(rawAlt) : accessibleName;
      const altText =
        typeof cleanedAlt === "string" && cleanedAlt.trim().length > 0
          ? cleanedAlt.trim()
          : accessibleName;

      const rawSlug = sauce.slug ?? null;
      const slugValue =
        typeof rawSlug === "string" && rawSlug.length > 0
          ? (stegaClean(rawSlug) ?? rawSlug)
          : rawSlug;
      const slugString =
        typeof slugValue === "string" && slugValue.length > 0
          ? slugValue
          : null;

      return {
        id: sauce._id,
        name,
        href: normalizeSauceHref(slugString),
        image: toSanityImageData(sauce.mainImage ?? null),
        alt: altText,
      } satisfies SauceDisplayItem;
    })
    .filter(Boolean) as SauceDisplayItem[];
}

function SauceList({
  title,
  items,
}: {
  title: string;
  items: SauceDisplayItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <div className="text-xs text-th-dark-600">{title}</div>
      <ul className="mt-2 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <SauceLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SauceLink({ item }: { item: SauceDisplayItem }) {
  const fallbackInitial = item.alt.charAt(0)?.toUpperCase() || "S";

  const content = (
    <>
      {item.image ? (
        <SanityImage
          image={item.image}
          alt={item.alt}
          width={80}
          height={80}
          className="h-12 w-12 rounded-sm object-cover"
          sizes="48px"
          loading="lazy"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-sm bg-th-light-200 text-xs font-semibold text-th-dark-600"
        >
          {fallbackInitial}
        </div>
      )}
      <span className="text-sm font-medium text-th-dark-900">{item.name}</span>
    </>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        aria-label={`View sauce ${item.alt}`}
        className="group inline-flex w-full items-center gap-3 rounded-md border border-brand-green/20 bg-white/70 px-3 py-2 transition-colors hover:bg-brand-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="inline-flex w-full items-center gap-3 rounded-md border border-muted-foreground/20 bg-white/60 px-3 py-2">
      {content}
    </div>
  );
}

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
  valueClassName,
  className,
}: {
  title: string;
  children: React.ReactNode;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <InfoLabel asChild>
        <dt>{title}</dt>
      </InfoLabel>
      <dd className={cn(valueClassName ?? "mt-2 flex flex-wrap gap-2")}>
        {children}
      </dd>
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
      const href = buildRecipesFilterLink({ meats: [slugValue] });
      return (
        <Badge
          key={`${slugValue}-${String(value)}`}
          text={cfg.display}
          variant="meat"
          className="text-sm"
          href={href}
          aria-label={`View recipes featuring ${cfg.display}`}
        />
      );
    })
    .filter(Boolean);

  const tagBadges = (recipe.tags ?? [])
    .map((value) => {
      const slugValue = toRecipeTagSlug(value);
      if (!slugValue) return null;
      const cfg = tagMap[slugValue];
      const href = buildRecipesFilterLink({ tags: [slugValue] });
      return (
        <Badge
          key={`${slugValue}-${String(value)}`}
          text={cfg.display}
          variant={cfg.badgeVariant}
          className="text-sm"
          href={href}
          aria-label={`View ${cfg.display} recipes`}
        />
      );
    })
    .filter(Boolean);

  const categoryBadges = (recipe.categories ?? [])
    .map((cat) => {
      if (!cat?.title) return null;
      const cleanedTitle = stegaClean(cat.title);
      const accessibleTitle =
        typeof cleanedTitle === "string" && cleanedTitle.trim().length > 0
          ? cleanedTitle.trim()
          : cat.title;
      const href = buildRecipesFilterLink({ categoryId: cat._id });
      return (
        <Badge
          key={cat._id}
          text={cat.title}
          variant="outline"
          className="text-sm"
          href={href}
          aria-label={`View recipes in ${accessibleTitle}`}
        />
      );
    })
    .filter(Boolean);

  const originalSauces = mapSaucesToDisplay(recipe.dgfSauces);
  const premiumSauces = mapSaucesToDisplay(recipe.lfdSauces);

  // We intentionally preserve stega metadata in visible rich text below.

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
                      "cursor-pointer rounded-none rounded-b-none border px-4 py-3 text-base font-medium transition-all opacity-80 hover:opacity-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-selected:opacity-100 aria-selected:py-4",
                      "rounded-tl-sm border-brand-green/80 bg-brand-green/90 text-brand-green-text hover:bg-brand-green aria-selected:border-brand-green aria-selected:bg-brand-green aria-selected:text-brand-green-text aria-selected:rounded-tr-sm",
                    )}
                  >
                    <BrandTabLabel variant="original" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="premium"
                    className={cn(
                      "cursor-pointer rounded-none rounded-b-none border px-4 py-3 text-base font-medium transition-all opacity-80 hover:opacity-90 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 aria-selected:opacity-100 aria-selected:py-4",
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
              <dl className="mt-4 grid gap-5 md:grid-cols-2">
                {recipe.serves ? (
                  <InfoRow title="Serves" valueClassName="mt-1">
                    {recipe.serves}
                  </InfoRow>
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

                {(originalSauces.length > 0 || premiumSauces.length > 0) && (
                  <div className="md:col-span-2">
                    <InfoLabel asChild>
                      <dt>Sauces</dt>
                    </InfoLabel>
                    <dd className="mt-2 space-y-6">
                      <SauceList
                        title="DelGrosso Original Sauces:"
                        items={originalSauces}
                      />
                      <SauceList
                        title="La Famiglia DelGrosso sauces:"
                        items={premiumSauces}
                      />
                    </dd>
                  </div>
                )}
              </dl>
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

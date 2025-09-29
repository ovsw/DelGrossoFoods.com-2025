import { Badge } from "@workspace/ui/components/badge";
import { InfoLabel } from "@workspace/ui/components/info-label";
import { cn } from "@workspace/ui/lib/utils";
import { stegaClean } from "next-sanity";

import {
  meatMap,
  tagMap,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import type { RecipeDetailData } from "@/types";

import { buildRecipesFilterLink } from "./utils";

export function InfoRow({
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
    <div className={className} data-html="c-info-row">
      <InfoLabel asChild>
        <dt data-html="c-info-row-title">{title}</dt>
      </InfoLabel>
      <dd
        className={cn(valueClassName ?? "mt-2 flex flex-wrap gap-2")}
        data-html="c-info-row-value"
      >
        {children}
      </dd>
    </div>
  );
}

export function RecipeBadges({ recipe }: { recipe: RecipeDetailData }) {
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

  return {
    meatBadges,
    tagBadges,
    categoryBadges,
  };
}

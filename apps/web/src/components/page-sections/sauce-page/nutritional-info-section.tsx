import { Button } from "@workspace/ui/components/button";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { Section } from "@workspace/ui/components/section";
import { Search } from "lucide-react";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import {
  type NutritionFactRow,
  NutritionFactsPanel,
} from "@/components/sauces/nutrition-facts-panel";
import { urlFor } from "@/lib/sanity/client";
import type { GetSauceBySlugQueryResult } from "@/lib/sanity/sanity.types";

type SauceNutritionalInfoSectionProps = {
  readonly sauce: NonNullable<GetSauceBySlugQueryResult>;
};

type NutritionData = NonNullable<
  NonNullable<GetSauceBySlugQueryResult>["nutritionalInfo"]
>;

function clean(value: unknown): string {
  if (!value) return "";
  const stringValue = typeof value === "string" ? value : String(value);
  const cleaned = stegaClean(stringValue);
  if (typeof cleaned === "string") {
    return cleaned.trim();
  }
  return stringValue.trim();
}

function splitLines(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function SauceNutritionalInfoSection({
  sauce,
}: SauceNutritionalInfoSectionProps) {
  const nutrition: Partial<NutritionData> = sauce.nutritionalInfo ?? {};
  const servingsPerContainer = clean(nutrition.servingsPerContainer);
  const servingSize = clean(nutrition.servingSize);
  const gramsPerServing = clean(nutrition.gramsPerServing);
  const calories = clean(nutrition.calories) || "0";
  const sauceName = clean(sauce.name);

  const ingredients = splitLines(clean(sauce.ingredients ?? ""));
  const allergens = splitLines(clean(sauce.allergens ?? ""));

  const servingDescriptionParts = [
    servingSize,
    gramsPerServing ? `(${gramsPerServing}g)` : "",
  ].filter(Boolean);

  const servingsSummaryText =
    servingsPerContainer && servingsPerContainer.length > 0
      ? `About ${servingsPerContainer} servings per container.`
      : null;
  const servingDescriptionText =
    servingDescriptionParts.length > 0
      ? servingDescriptionParts.join(" ")
      : null;

  const nutritionRows: NutritionFactRow[] = [
    {
      label: "Total Fat",
      value: clean(nutrition.totalFat),
      dailyValue: clean(nutrition.totalFatPerc),
      isBold: true,
    },
    {
      label: "Saturated Fat",
      value: clean(nutrition.saturatedFat),
      dailyValue: clean(nutrition.saturatedFatPerc),
      isIndented: true,
    },
    {
      label: "Trans Fat",
      value: clean(nutrition.transFat),
      srOnlyDailyText: "No recommended daily value",
      isIndented: true,
    },
    {
      label: "Cholesterol",
      value: clean(nutrition.cholesterol),
      dailyValue: clean(nutrition.cholesterolPerc),
      isBold: true,
    },
    {
      label: "Sodium",
      value: clean(nutrition.sodium),
      dailyValue: clean(nutrition.sodiumPerc),
      isBold: true,
    },
    {
      label: "Total Carbohydrates",
      value: clean(nutrition.totalCarbohydrate),
      dailyValue: clean(nutrition.totalCarbohydratePerc),
      isBold: true,
    },
    {
      label: "Dietary Fiber",
      value: clean(nutrition.dietaryFiber),
      dailyValue: clean(nutrition.dietaryFiberPerc),
      isIndented: true,
    },
    {
      label: "Total Sugars",
      value: clean(nutrition.totalSugars),
      srOnlyDailyText: "No recommended daily value",
      isIndented: true,
    },
    {
      label: "Includes",
      value: clean(nutrition.addedSugars),
      dailyValue: clean(nutrition.addedSugarsPerc),
      isIndented: true,
      valueSuffix: " Added Sugars",
    },
    {
      label: "Protein",
      value: clean(nutrition.protein),
      srOnlyDailyText: "No recommended daily value",
      hasThickDivider: true,
      isBold: true,
    },
    {
      label: "Vitamin D",
      value: clean(nutrition.vitaminD),
      dailyValue: clean(nutrition.vitaminDPerc),
    },
    {
      label: "Calcium",
      value: clean(nutrition.calcium),
      dailyValue: clean(nutrition.calciumPerc),
    },
    {
      label: "Iron",
      value: clean(nutrition.iron),
      dailyValue: clean(nutrition.ironPerc),
    },
    {
      label: "Potassium",
      value: clean(nutrition.potassium),
      dailyValue: clean(nutrition.potassiumPerc),
      hasThickDivider: true,
    },
  ].filter((row) => row.value);

  const dailyValueNote =
    "* Percent Daily Values are based on a 2,000 calorie diet.";
  const labelImage = sauce.labelFlatImage;
  const labelImageUrl = labelImage?.id
    ? urlFor({ ...labelImage, _id: labelImage.id })
        .width(2000)
        .dpr(2)
        .url()
    : null;
  const labelAlt = clean(labelImage?.alt ?? "");

  const labelButtonAriaLabel = labelImageUrl
    ? `View ${sauceName || "the sauce"} full label`
    : "";

  return (
    <Section
      spacingTop="large"
      spacingBottom="large"
      aria-labelledby="nutritional-info-heading"
    >
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-2 ">
          <div className="grid grid-rows-[auto_1fr_auto] gap-6 items-center justify-items-center text-center lg:items-start lg:justify-items-start lg:text-left">
            <Eyebrow text="Nutrition Facts" />

            <div className="grid w-full max-w-xl gap-8 text-left">
              <div className="grid gap-4 text-center lg:text-left">
                <h2
                  id="nutritional-info-heading"
                  className="text-4xl font-semibold text-brand-green lg:text-5xl"
                >
                  Nutritional Info
                </h2>
                {servingsSummaryText ? (
                  <p className="text-muted-foreground">{servingsSummaryText}</p>
                ) : null}
                {servingDescriptionText ? (
                  <p className="text-sm text-muted-foreground">
                    Serving size {servingDescriptionText}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-6">
                {ingredients.length > 0 ? (
                  <div className="grid gap-2 text-left">
                    <h3 className="text-xl font-semibold text-foreground">
                      Ingredients
                    </h3>
                    <ul className="text-sm text-muted-foreground">
                      {ingredients.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {allergens.length > 0 ? (
                  <div className="grid gap-2 text-left">
                    <h3 className="text-xl font-semibold text-foreground">
                      Allergens
                    </h3>
                    <ul className="text-sm text-muted-foreground">
                      {allergens.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="grid gap-2 text-center lg:text-left">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                    Daily value guidance
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {dailyValueNote}
                  </p>
                </div>
              </div>
            </div>

            {labelImageUrl ? (
              <Button
                asChild
                variant="outline"
                className="w-full gap-2 sm:w-auto"
                aria-label={labelButtonAriaLabel}
              >
                <Link
                  href={labelImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={labelAlt || labelButtonAriaLabel}
                >
                  <Search className="size-4" aria-hidden="true" />
                  <span>View Full Label</span>
                </Link>
              </Button>
            ) : null}
          </div>

          <div className="h-full w-full self-center">
            <NutritionFactsPanel
              servingsPerContainerText={servingsSummaryText}
              servingDescriptionText={servingDescriptionText}
              calories={calories}
              rows={nutritionRows}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

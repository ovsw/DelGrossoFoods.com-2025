import { Section } from "@workspace/ui/components/section";
import { stegaClean } from "next-sanity";

import type { GetSauceBySlugQueryResult } from "@/lib/sanity/sanity.types";

type SauceNutritionalInfoProps = {
  readonly sauce: NonNullable<GetSauceBySlugQueryResult>;
};

type NutritionRow = {
  readonly label: string;
  readonly value: string | null;
  readonly dailyValue?: string | null;
  readonly isBold?: boolean;
  readonly isIndented?: boolean;
  readonly hasThickDivider?: boolean;
  readonly srOnlyDailyText?: string;
  readonly valuePrefix?: string;
  readonly valueSuffix?: string;
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

export function SauceNutritionalInfo({ sauce }: SauceNutritionalInfoProps) {
  const nutrition: Partial<NutritionData> = sauce.nutritionalInfo ?? {};
  const servingsPerContainer = clean(nutrition.servingsPerContainer);
  const servingSize = clean(nutrition.servingSize);
  const gramsPerServing = clean(nutrition.gramsPerServing);
  const calories = clean(nutrition.calories) || "0";

  const ingredients = splitLines(clean(sauce.ingredients ?? ""));
  const allergens = splitLines(clean(sauce.allergens ?? ""));

  const servingDescriptionParts = [
    servingSize,
    gramsPerServing ? `(${gramsPerServing})` : "",
  ].filter(Boolean);

  const nutritionRows: NutritionRow[] = [
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

  const hasNutritionDetails = nutritionRows.length > 0;

  return (
    <Section
      spacingTop="large"
      spacingBottom="large"
      aria-labelledby="nutritional-info-heading"
    >
      <div className="container mx-auto grid gap-12 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-8">
          <div>
            <h2
              id="nutritional-info-heading"
              className="text-3xl font-semibold text-brand-green"
            >
              Nutritional Info
            </h2>
            {servingsPerContainer && (
              <p className="mt-4 text-base text-muted-foreground">
                About {servingsPerContainer} servings per container.
              </p>
            )}
            {servingDescriptionParts.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Serving size {servingDescriptionParts.join(" ")}
              </p>
            )}
          </div>

          {ingredients.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Ingredients
              </h3>
              <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                {ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {allergens.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Allergens
              </h3>
              <ul className="mt-3 list-disc space-y-1 ps-5 text-sm text-muted-foreground">
                {allergens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5">
          <div className="border-b border-black pb-4 text-sm font-medium text-muted-foreground">
            <p className="text-muted-foreground">
              {servingsPerContainer
                ? `About ${servingsPerContainer} servings per container.`
                : "Serving details"}
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              Amount per serving
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {servingDescriptionParts.join(" ") || "Per label"}
            </p>
          </div>

          <div className="border-b border-black py-4">
            <div className="flex items-end justify-between text-4xl font-semibold tracking-tight text-foreground">
              <span>Calories</span>
              <span>{calories}</span>
            </div>
          </div>

          {hasNutritionDetails ? (
            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr className="text-left font-semibold text-muted-foreground">
                  <th className="py-2">Per serving</th>
                  <th className="py-2 text-right">% Daily Value*</th>
                </tr>
              </thead>
              <tbody>
                {nutritionRows.map(
                  ({
                    label,
                    value,
                    dailyValue,
                    isBold,
                    isIndented,
                    hasThickDivider,
                    srOnlyDailyText,
                    valuePrefix,
                    valueSuffix,
                  }) => (
                    <tr
                      key={label}
                      className={[
                        "border-b border-muted-foreground/40",
                        hasThickDivider
                          ? "border-b-4 border-muted-foreground/60"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <td
                        className={[
                          "py-2 text-foreground",
                          isIndented ? "ps-6" : "",
                          isBold ? "font-semibold" : "font-medium",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <span>{label}</span>
                        {value && (
                          <span>
                            {" "}
                            {valuePrefix ?? ""}
                            {value}
                            {valueSuffix ?? ""}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right text-foreground">
                        {dailyValue ? (
                          dailyValue
                        ) : srOnlyDailyText ? (
                          <span className="sr-only">{srOnlyDailyText}</span>
                        ) : null}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Nutritional details are coming soon.
            </p>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            * Percent Daily Values are based on a 2,000 calorie diet.
          </p>
        </div>
      </div>
    </Section>
  );
}

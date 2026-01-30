import { urlFor } from "@workspace/sanity-config/client";
import type { GetSauceBySlugQueryResult } from "@workspace/sanity-config/types";
import { Button } from "@workspace/ui/components/button";
import { Eyebrow } from "@workspace/ui/components/eyebrow";
import { SectionShell } from "@workspace/ui/components/section-shell";
import { Search } from "lucide-react";
import Link from "next/link";
import { stegaClean } from "next-sanity";

import {
  type NutritionFactRow,
  NutritionFactsPanel,
} from "@/components/elements/nutrition-facts-panel";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";

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
  const documentId = sauce._id ?? null;
  const documentType = sauce._type ?? null;

  const nutrition: Partial<NutritionData> = sauce.nutritionalInfo ?? {};
  const servingsPerContainer = clean(nutrition.servingsPerContainer);
  const servingSize = clean(nutrition.servingSize);
  const gramsPerServing = clean(nutrition.gramsPerServing);
  const calories = clean(nutrition.calories) || "0";
  const sauceName = clean(sauce.name);

  // Get raw values (with stega) for clickable text
  const rawServingsPerContainer =
    typeof nutrition.servingsPerContainer === "string"
      ? nutrition.servingsPerContainer
      : null;
  const rawServingSize =
    typeof nutrition.servingSize === "string" ? nutrition.servingSize : null;
  const rawGramsPerServing =
    typeof nutrition.gramsPerServing === "string"
      ? nutrition.gramsPerServing
      : null;
  const rawCalories =
    typeof nutrition.calories === "string" && nutrition.calories.trim()
      ? nutrition.calories
      : null;
  const rawIngredients =
    typeof sauce.ingredients === "string" ? sauce.ingredients : "";
  const rawAllergens =
    typeof sauce.allergens === "string" ? sauce.allergens : "";

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

  // Generate data attributes for all nutrition fields
  const caloriesDataAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "nutritionalInfo.calories",
  });
  const servingsPerContainerDataAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "nutritionalInfo.servingsPerContainer",
  });
  const servingSizeDataAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "nutritionalInfo.servingSize",
  });
  const gramsPerServingDataAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "nutritionalInfo.gramsPerServing",
  });
  const ingredientsDataAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "ingredients",
  });
  const allergensDataAttribute = createPresentationDataAttribute({
    documentId,
    documentType,
    path: "allergens",
  });

  const nutritionRows: NutritionFactRow[] = [
    {
      label: "Total Fat",
      value: clean(nutrition.totalFat),
      dailyValue: clean(nutrition.totalFatPerc),
      isBold: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.totalFat",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.totalFatPerc",
      }),
    },
    {
      label: "Saturated Fat",
      value: clean(nutrition.saturatedFat),
      dailyValue: clean(nutrition.saturatedFatPerc),
      isIndented: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.saturatedFat",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.saturatedFatPerc",
      }),
    },
    {
      label: "Trans Fat",
      value: clean(nutrition.transFat),
      srOnlyDailyText: "No recommended daily value",
      isIndented: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.transFat",
      }),
    },
    {
      label: "Cholesterol",
      value: clean(nutrition.cholesterol),
      dailyValue: clean(nutrition.cholesterolPerc),
      isBold: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.cholesterol",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.cholesterolPerc",
      }),
    },
    {
      label: "Sodium",
      value: clean(nutrition.sodium),
      dailyValue: clean(nutrition.sodiumPerc),
      isBold: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.sodium",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.sodiumPerc",
      }),
    },
    {
      label: "Total Carbohydrates",
      value: clean(nutrition.totalCarbohydrate),
      dailyValue: clean(nutrition.totalCarbohydratePerc),
      isBold: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.totalCarbohydrate",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.totalCarbohydratePerc",
      }),
    },
    {
      label: "Dietary Fiber",
      value: clean(nutrition.dietaryFiber),
      dailyValue: clean(nutrition.dietaryFiberPerc),
      isIndented: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.dietaryFiber",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.dietaryFiberPerc",
      }),
    },
    {
      label: "Total Sugars",
      value: clean(nutrition.totalSugars),
      srOnlyDailyText: "No recommended daily value",
      isIndented: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.totalSugars",
      }),
    },
    {
      label: "Includes",
      value: clean(nutrition.addedSugars),
      dailyValue: clean(nutrition.addedSugarsPerc),
      isIndented: true,
      valueSuffix: " Added Sugars",
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.addedSugars",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.addedSugarsPerc",
      }),
    },
    {
      label: "Protein",
      value: clean(nutrition.protein),
      srOnlyDailyText: "No recommended daily value",
      hasThickDivider: true,
      isBold: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.protein",
      }),
    },
    {
      label: "Vitamin D",
      value: clean(nutrition.vitaminD),
      dailyValue: clean(nutrition.vitaminDPerc),
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.vitaminD",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.vitaminDPerc",
      }),
    },
    {
      label: "Calcium",
      value: clean(nutrition.calcium),
      dailyValue: clean(nutrition.calciumPerc),
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.calcium",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.calciumPerc",
      }),
    },
    {
      label: "Iron",
      value: clean(nutrition.iron),
      dailyValue: clean(nutrition.ironPerc),
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.iron",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.ironPerc",
      }),
    },
    {
      label: "Potassium",
      value: clean(nutrition.potassium),
      dailyValue: clean(nutrition.potassiumPerc),
      hasThickDivider: true,
      valueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.potassium",
      }),
      dailyValueDataAttribute: createPresentationDataAttribute({
        documentId,
        documentType,
        path: "nutritionalInfo.potassiumPerc",
      }),
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
    <SectionShell
      spacingTop="large"
      spacingBottom="default"
      background="transparent"
      innerClassName="container max-w-[64rem] mx-auto px-4 md:px-6"
      aria-labelledby="nutritional-info-heading"
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
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
            </div>

            <div className="grid gap-6">
              {servingsSummaryText || servingDescriptionText ? (
                <div className="grid gap-2 text-left">
                  <h3 className="text-xl font-semibold text-foreground">
                    Serving Size
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {servingsSummaryText ? (
                      <p>
                        {servingsPerContainerDataAttribute ? (
                          <>
                            About{" "}
                            <span
                              data-sanity={servingsPerContainerDataAttribute}
                            >
                              {rawServingsPerContainer || servingsPerContainer}
                            </span>{" "}
                            servings per container.
                          </>
                        ) : (
                          servingsSummaryText
                        )}
                      </p>
                    ) : null}
                    {servingDescriptionText ? (
                      <p>
                        Serving size{" "}
                        {servingSizeDataAttribute ||
                        gramsPerServingDataAttribute ? (
                          <>
                            {servingSizeDataAttribute ? (
                              <span data-sanity={servingSizeDataAttribute}>
                                {rawServingSize || servingSize}
                              </span>
                            ) : (
                              servingSize
                            )}
                            {rawGramsPerServing &&
                            gramsPerServingDataAttribute ? (
                              <>
                                {" "}
                                (
                                <span
                                  data-sanity={gramsPerServingDataAttribute}
                                >
                                  {rawGramsPerServing}g
                                </span>
                                )
                              </>
                            ) : gramsPerServing ? (
                              ` (${gramsPerServing}g)`
                            ) : null}
                          </>
                        ) : (
                          servingDescriptionText
                        )}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {ingredients.length > 0 ? (
                <div className="grid gap-2 text-left">
                  <h3 className="text-xl font-semibold text-foreground">
                    Ingredients
                  </h3>
                  <ul className="text-sm text-muted-foreground">
                    {ingredients.map((item, index) => (
                      <li key={item}>
                        {ingredientsDataAttribute ? (
                          <span data-sanity={ingredientsDataAttribute}>
                            {item}
                          </span>
                        ) : (
                          item
                        )}
                      </li>
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
                      <li key={item}>
                        {allergensDataAttribute ? (
                          <span data-sanity={allergensDataAttribute}>
                            {item}
                          </span>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Daily value guidance moved into NutritionFactsPanel footer */}
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
            calories={rawCalories ?? calories}
            rows={nutritionRows}
            dailyValueNoteText={dailyValueNote}
            caloriesDataAttribute={caloriesDataAttribute}
            servingsPerContainerDataAttribute={
              servingsPerContainerDataAttribute
            }
            servingDescriptionDataAttribute={servingSizeDataAttribute}
          />
        </div>
      </div>
    </SectionShell>
  );
}

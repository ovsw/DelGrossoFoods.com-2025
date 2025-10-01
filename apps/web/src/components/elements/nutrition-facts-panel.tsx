import type { HTMLAttributes } from "react";

export type NutritionFactRow = {
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

type NutritionFactsPanelProps = {
  readonly servingsPerContainerText?: string | null;
  readonly servingDescriptionText?: string | null;
  readonly calories: string;
  readonly rows: NutritionFactRow[];
  readonly emptyStateMessage?: string;
} & HTMLAttributes<HTMLDivElement>;

export function NutritionFactsPanel({
  servingsPerContainerText,
  servingDescriptionText,
  calories,
  rows,
  emptyStateMessage = "Nutritional details are coming soon.",
  className,
  ...props
}: NutritionFactsPanelProps) {
  const hasRows = rows.length > 0;
  const servingsSummary = servingsPerContainerText?.trim();
  const servingDescriptor = servingDescriptionText?.trim();

  return (
    <div className={className} {...props}>
      <div className="mx-auto max-w-sm rounded bg-white p-6 shadow-lg ring-1 ring-black/5">
        <div className="border-b-24 border-black pb-4 text-sm font-medium text-muted-foreground">
          <p className="text-muted-foreground">
            {servingsSummary ? servingsSummary : "Serving details"}
          </p>
          <p className="mt-2 flex justify-between text-sm font-semibold text-foreground">
            <span>Amount per serving</span>
            <span>{servingDescriptor || "Per label"}</span>
          </p>
        </div>

        <div className="border-b-10 border-black py-4">
          <div className="flex items-end justify-between text-4xl font-semibold tracking-tight text-foreground">
            <span>Calories</span>
            <span>{calories}</span>
          </div>
        </div>

        {hasRows ? (
          <table className="mt-4 w-full border-collapse text-sm">
            <thead>
              <tr className="text-left">
                <th className="flex w-full justify-between py-2 text-sm text-muted-foreground">
                  Per serving
                </th>
                <th className="text-right">% Daily Value*</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(
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
                      hasThickDivider ? "border-b-4 border-primary" : "",
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
            {emptyStateMessage}
          </p>
        )}
      </div>
    </div>
  );
}

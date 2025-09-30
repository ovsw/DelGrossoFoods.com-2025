import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { announce } from "@/lib/a11y/announce";

type VariantKey = "original" | "premium";

export function useVariantState(available: VariantKey[]) {
  // Guard against empty available array to prevent crashes
  if (available.length === 0) {
    throw new Error("available must contain at least one VariantKey");
  }

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
    return available[0]!; // Safe after length check above
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

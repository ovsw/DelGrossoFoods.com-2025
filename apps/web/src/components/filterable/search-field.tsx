"use client";
import { Button } from "@workspace/ui/components/button";
import { Search as SearchIcon } from "lucide-react";
import type { ChangeEvent } from "react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  clearButtonVariant?: "secondary" | "ghost";
  visuallyHideLabel?: boolean;
};

export function SearchField({
  id,
  label,
  value,
  onChange,
  placeholder = "Search",
  ariaLabel,
  clearButtonVariant = "secondary",
  visuallyHideLabel = false,
}: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className={visuallyHideLabel ? "sr-only" : "block text-xl font-medium"}
      >
        {label}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <div className="relative w-full">
          <SearchIcon
            className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id={id}
            type="search"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(e.currentTarget.value)
            }
            className="w-full rounded-md border border-input bg-white/70 ps-9 pe-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder={placeholder}
            aria-label={ariaLabel ?? label}
          />
        </div>
        {value ? (
          <Button
            type="button"
            variant={clearButtonVariant}
            className="cursor-pointer"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}

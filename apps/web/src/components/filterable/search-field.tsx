"use client";
import { Button } from "@workspace/ui/components/button";
import type { ChangeEvent } from "react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  clearButtonVariant?: "secondary" | "ghost";
};

export function SearchField({
  id,
  label,
  value,
  onChange,
  placeholder = "Search",
  ariaLabel,
  clearButtonVariant = "secondary",
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-xl font-medium">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-2">
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.currentTarget.value)
          }
          className="w-full rounded-md border border-input bg-white/70 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder={placeholder}
          aria-label={ariaLabel ?? label}
        />
        {value ? (
          <Button
            type="button"
            variant={clearButtonVariant}
            onClick={() => onChange("")}
          >
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}

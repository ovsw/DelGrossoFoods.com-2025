"use client";

import { Search as SearchIcon, X } from "lucide-react";
import type { ChangeEvent } from "react";

type SearchFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  visuallyHideLabel?: boolean;
};

export function SearchField({
  id,
  label,
  value,
  onChange,
  placeholder = "Search",
  ariaLabel,
  visuallyHideLabel = false,
}: SearchFieldProps) {
  return (
    <div role="search" aria-label={ariaLabel ?? label}>
      <label
        htmlFor={id}
        className={visuallyHideLabel ? "sr-only" : "block text-xl font-medium"}
      >
        {label}
      </label>
      <div className="mt-2 relative w-full">
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
          className="w-full rounded-md border border-input bg-white/70 ps-9 pe-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:ring-inset [&::-webkit-search-cancel-button]:hidden"
          placeholder={placeholder}
          aria-label={ariaLabel ?? label}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 end-1 my-auto flex size-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer transition-colors"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

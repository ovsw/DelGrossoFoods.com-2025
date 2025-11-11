"use client";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type SortDropdownOption<T extends string = string> = {
  value: T;
  label: string;
};

type SortDropdownProps<T extends string = string> = {
  value: T;
  onChange: (next: T) => void;
  options?: SortDropdownOption<T>[];
  label?: string;
  triggerLabel?: string;
  className?: string;
};

const DEFAULT_OPTIONS: ReadonlyArray<SortDropdownOption> = [
  { value: "az", label: "A → Z" },
  { value: "za", label: "Z → A" },
];

export function SortDropdown<T extends string = string>({
  value,
  onChange,
  options,
  label = "Sort",
  triggerLabel = "Sort",
  className,
}: SortDropdownProps<T>) {
  const resolvedOptions = (options ?? DEFAULT_OPTIONS) as ReadonlyArray<
    SortDropdownOption<T>
  >;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary" className={className}>
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => onChange(next as T)}
        >
          {resolvedOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

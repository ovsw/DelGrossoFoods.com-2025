"use client";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import type { SortOrder } from "@/types";

type Props = {
  value: SortOrder;
  onChange: (next: SortOrder) => void;
  label?: string;
  className?: string;
};

export function SortDropdown({
  value,
  onChange,
  label = "Sort by name",
  className,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="secondary" className={className}>
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            const order = next === "az" || next === "za" ? next : "az";

            onChange(order);
          }}
        >
          <DropdownMenuRadioItem value="az">A → Z</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="za">Z → A</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

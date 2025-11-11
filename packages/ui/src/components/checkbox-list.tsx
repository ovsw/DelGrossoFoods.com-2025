"use client";
import type { ReactNode } from "react";

import { Checkbox } from "./checkbox";

export type CheckboxListItem = {
  id: string;
  label: ReactNode;
  checked: boolean;
  ariaLabel?: string;
};

export type CheckboxListProps = {
  items: CheckboxListItem[];
  onToggle: (id: string, checked: boolean) => void;
  className?: string;
};

export function CheckboxList({
  items,
  onToggle,
  className,
}: CheckboxListProps) {
  return (
    <div className={className ?? "mt-2 grid grid-cols-1 gap-2"}>
      {items.map((item) => {
        const labelId = `${item.id}-label`;

        return (
          <label
            key={item.id}
            htmlFor={item.id}
            className="flex items-center gap-2"
          >
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={() => {
                const nextChecked = !item.checked;
                onToggle(item.id, nextChecked);
              }}
              aria-labelledby={item.ariaLabel ? undefined : labelId}
              aria-label={item.ariaLabel}
            />
            <span id={labelId}>{item.label}</span>
          </label>
        );
      })}
    </div>
  );
}

"use client";
import type { ReactNode } from "react";

import { RadioGroup, RadioGroupItem } from "./radio-group";

export type RadioListItem = {
  id: string;
  value: string;
  label: ReactNode;
  ariaLabel?: string;
};

export type RadioListProps = {
  value: string;
  onChange: (value: string) => void;
  items: RadioListItem[];
  className?: string;
};

export function RadioList({
  value,
  onChange,
  items,
  className,
}: RadioListProps) {
  return (
    <div className={className ?? "mt-2 grid grid-cols-1 gap-2"}>
      <RadioGroup value={value} onValueChange={onChange}>
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-2"
            htmlFor={item.id}
          >
            <RadioGroupItem
              id={item.id}
              value={item.value}
              {...(item.ariaLabel ? { "aria-label": item.ariaLabel } : {})}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

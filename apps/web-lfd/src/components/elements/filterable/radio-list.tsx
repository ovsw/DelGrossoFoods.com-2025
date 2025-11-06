"use client";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import type { ReactNode } from "react";

export type RadioItem = {
  id: string;
  value: string;
  label: ReactNode;
  ariaLabel?: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  items: RadioItem[];
  className?: string;
};

export function RadioList({ value, onChange, items, className }: Props) {
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

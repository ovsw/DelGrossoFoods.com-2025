"use client";
import { Button } from "@workspace/ui/components/button";

type Props = {
  onClear: () => void;
  show: boolean;
  label?: string;
};

export function ClearSection({ onClear, show, label = "Clear" }: Props) {
  if (!show) return null;
  return (
    <div className="mt-2">
      <Button type="button" variant="ghost" onClick={onClear}>
        {label}
      </Button>
    </div>
  );
}

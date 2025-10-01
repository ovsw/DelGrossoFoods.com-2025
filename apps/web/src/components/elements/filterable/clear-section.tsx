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
    <Button
      type="button"
      variant="link"
      size="sm"
      className="px-0 h-auto cursor-pointer underline font-medium"
      onClick={onClear}
    >
      {label}
    </Button>
  );
}

import { cn } from "@workspace/ui/lib/utils";

interface SurfaceShineOverlayProps {
  className?: string;
}

export function SurfaceShineOverlay({ className }: SurfaceShineOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-[2px] top-[1px] z-10 border-t-2 border-white/50 border-b-2",
        "bg-[linear-gradient(0deg,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0)_50%,rgba(255,255,255,0)_85%,rgba(255,255,255,0.15)_100%)]",
        "rounded-b-2xl",
        className,
      )}
      aria-hidden="true"
    />
  );
}

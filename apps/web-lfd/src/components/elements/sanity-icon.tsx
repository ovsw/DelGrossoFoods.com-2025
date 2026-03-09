import { cn } from "@workspace/ui/lib/utils";
import type { ComponentProps } from "react";
import { memo } from "react";

interface IconProps extends Omit<ComponentProps<"span">, "src"> {
  icon?:
    | {
        svg?: string | null;
        name?: string | null;
      }
    | string
    | null;
  alt?: string; // Add alt text prop for accessibility
}

export const SanityIcon = memo(function SanityIconUnmemorized({
  icon,
  className,
  alt: altText = "sanity-icon",
  ...props
}: IconProps) {
  const alt = typeof icon === "object" && icon?.name ? icon?.name : altText;
  const svg = typeof icon === "object" ? icon?.svg : icon;
  const normalizedSvg = svg?.replace(/<svg\b([^>]*)>/i, (match, attrs) => {
    const normalizedAttrs = attrs
      .replace(/\s(width|height)=(["']).*?\2/gi, "")
      .trim();

    return `<svg ${normalizedAttrs} width="100%" height="100%">`;
  });

  if (!normalizedSvg) {
    return null;
  }

  return (
    <span
      {...props}
      className={cn(
        "flex size-12 items-center justify-center sanity-icon [&_svg]:size-full [&_svg]:max-h-none [&_svg]:max-w-none",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: normalizedSvg }}
      aria-label={alt}
      title={alt}
    />
  );
});

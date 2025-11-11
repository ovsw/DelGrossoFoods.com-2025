import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

import { type RootProps } from "../lib/data-attributes";
import { cn } from "../lib/utils";
import { Badge, type BadgeVariant } from "./badge";

const ASPECT_CLASS = {
  sauce: "aspect-[33/40]",
  product: "aspect-[2/1]",
  recipe: "aspect-[3/2]",
} as const;

export type ListCardBadge = {
  text: string;
  variant?: BadgeVariant;
};

export type ListCardProps = {
  href: string;
  title: string;
  titleSecondary?: string | null;
  titleSecondaryContent?: ReactNode;
  subtitle?: string | null;
  subtitleContent?: ReactNode;
  badges?: ListCardBadge[];
  ariaLabel?: string | null;
  image?: ReactNode;
  imageAspect?: keyof typeof ASPECT_CLASS;
  imageFit?: "contain" | "cover";
  textAlign?: "center" | "start";
  rootProps?: RootProps<HTMLAnchorElement>;
  imageContainerProps?: RootProps<HTMLDivElement>;
  badgesRootProps?: RootProps<HTMLDivElement>;
};

export function ListCard({
  href,
  title,
  titleSecondary,
  titleSecondaryContent,
  subtitle,
  subtitleContent,
  badges = [],
  ariaLabel,
  image,
  imageAspect = "sauce",
  imageFit = "contain",
  textAlign = "center",
  rootProps,
  imageContainerProps,
  badgesRootProps,
}: ListCardProps) {
  const accessibleLabel =
    ariaLabel ??
    ([title, titleSecondary].filter(Boolean).join(" ") || undefined);
  const aspectClass = ASPECT_CLASS[imageAspect];
  const wrapperClassName =
    imageFit === "cover"
      ? cn(aspectClass, "relative overflow-hidden")
      : cn(aspectClass, "flex items-center justify-center overflow-hidden");
  const imageClassName =
    imageFit === "cover"
      ? "absolute inset-0 h-full w-full object-cover"
      : "max-h-full max-w-full object-contain";
  const titleAlignClass = textAlign === "center" ? "text-center" : "text-start";
  const subtitleAlignClass = titleAlignClass;
  const badgesJustifyClass =
    textAlign === "center" ? "justify-center" : "justify-start";

  const { className: linkClassName, ...restRootProps } = rootProps ?? {};
  const { className: imageContainerClassName, ...restImageContainerProps } =
    imageContainerProps ?? {};
  const { className: badgesClassName, ...restBadgesProps } =
    badgesRootProps ?? {};

  return (
    <Link
      href={href}
      aria-label={accessibleLabel}
      className={cn(
        "group block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
        linkClassName,
      )}
      {...restRootProps}
    >
      <div
        className={cn(wrapperClassName, imageContainerClassName)}
        {...restImageContainerProps}
      >
        {image ? (
          cloneWithClass(image, imageClassName)
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div className="py-4">
        <h3
          className={cn(
            "text-base font-semibold leading-tight group-hover:underline",
            titleAlignClass,
          )}
        >
          <span className="block">{title}</span>
          {titleSecondary || titleSecondaryContent ? (
            <span className="mt-0.5 block text-sm font-medium text-muted-foreground">
              {titleSecondaryContent ?? titleSecondary}
            </span>
          ) : null}
        </h3>

        {subtitle || subtitleContent ? (
          <p
            className={cn(
              "text-sm text-muted-foreground mt-1",
              subtitleAlignClass,
            )}
          >
            {subtitleContent ?? subtitle}
          </p>
        ) : null}

        {badges.length > 0 ? (
          <div
            className={cn(
              "mt-2 flex flex-wrap items-center gap-0.5",
              badgesJustifyClass,
              badgesClassName,
            )}
            {...restBadgesProps}
          >
            {badges.map((badge, index) => (
              <Badge
                key={`${badge.text}-${index}`}
                text={badge.text}
                variant={badge.variant}
                className="text-xs"
              />
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function cloneWithClass(node: ReactNode, className: string) {
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<{ className?: string }>;
  return cloneElement(element, {
    className: cn(element.props?.className, className),
  });
}

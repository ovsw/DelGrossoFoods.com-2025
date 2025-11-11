import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import {
  cloneElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { Badge, type BadgeVariant } from "./badge";

type RecipeCardMedia = ReactElement<{ className?: string }>;

export type RecipeCardBadge = {
  readonly text: string;
  readonly variant?: BadgeVariant;
};

export type RecipeCardSauce = {
  readonly name: string;
  readonly image?: RecipeCardMedia;
};

type LinkLikeProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href" | "children" | "className"
>;

type RecipeCardLayout = "featured" | "listing";

export type RecipeCardProps = {
  readonly title: string;
  readonly href?: string;
  readonly ariaLabel?: string;
  readonly image?: RecipeCardMedia;
  readonly badges?: RecipeCardBadge[];
  readonly sauces?: RecipeCardSauce[];
  readonly ctaLabel?: string;
  readonly ctaIcon?: ReactNode;
  readonly hideCtaVisually?: boolean;
  readonly layout?: RecipeCardLayout;
  readonly className?: string;
  readonly contentClassName?: string;
  readonly linkProps?: LinkLikeProps;
  readonly articleProps?: HTMLAttributes<HTMLElement>;
};

const CARD_BASE_CLASS =
  "group relative isolate flex h-full min-h-[36rem] flex-col overflow-hidden rounded-3xl bg-th-dark-900 text-th-light-100 shadow-xl transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green";

function enhanceMedia(node?: RecipeCardMedia, className?: string) {
  if (!node || !isValidElement(node)) {
    return null;
  }

  return cloneElement(node, {
    className: cn(
      "absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus:scale-105 group-focus-visible:scale-105",
      node.props.className,
      className,
    ),
  });
}

function enhanceSauceMedia(node?: RecipeCardMedia) {
  if (!node || !isValidElement(node)) {
    return null;
  }

  return cloneElement(node, {
    className: cn(
      "h-8 w-8 shrink-0 rounded-full border border-th-light-100/40 bg-th-light-100/10 object-contain p-0.5 shadow-sm",
      node.props.className,
    ),
  });
}

export function RecipeCard({
  title,
  href,
  ariaLabel,
  image,
  badges = [],
  sauces = [],
  ctaLabel = "View recipe",
  ctaIcon = <span aria-hidden="true">&rarr;</span>,
  hideCtaVisually = false,
  layout = "featured",
  className,
  contentClassName,
  linkProps,
  articleProps,
}: RecipeCardProps) {
  const heightClass = layout === "listing" ? "min-h-[28rem]" : "min-h-[36rem]";
  const containerGap = layout === "listing" ? "gap-3" : "gap-4";
  const mergedClassName = cn(CARD_BASE_CLASS, heightClass, className);
  const contentClasses = cn(
    "relative z-10 flex h-full flex-col justify-end p-6 sm:p-8",
    containerGap,
    contentClassName,
  );
  const renderBadges = badges.length > 0;
  const renderSauces = sauces.length > 0;
  const imageNode = enhanceMedia(image);

  const inner = (
    <>
      {imageNode}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/35 to-transparent"
        aria-hidden="true"
      />

      <div className={contentClasses}>
        <h3 className="text-2xl font-semibold leading-tight text-th-light-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          {title}
        </h3>

        {renderBadges ? (
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((badge, index) => (
              <Badge
                key={`${badge.text}-${index}`}
                text={badge.text}
                variant={badge.variant}
                className="text-xs font-medium"
              />
            ))}
          </div>
        ) : null}

        {renderSauces ? (
          <div className="flex flex-wrap items-center gap-3 text-sm text-th-light-200">
            <span>with</span>
            {sauces.map((sauce, index) => (
              <span
                key={`${sauce.name}-${index}`}
                className="inline-flex items-center gap-2"
              >
                {sauce.image ? enhanceSauceMedia(sauce.image) : null}
                <span>
                  {sauce.name}
                  {index < sauces.length - 1 ? "," : ""}
                </span>
              </span>
            ))}
          </div>
        ) : null}

        {hideCtaVisually ? (
          <span className="sr-only">{ctaLabel}</span>
        ) : (
          <span className="inline-flex items-center text-sm font-semibold text-brand-green-text transition-colors group-hover:text-th-light-100 group-focus:text-th-light-100 group-focus-visible:text-th-light-100">
            {ctaLabel}{" "}
            <span className="ms-1" aria-hidden="true">
              {ctaIcon}
            </span>
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={ariaLabel ?? title}
        className={mergedClassName}
        {...linkProps}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article
      aria-label={ariaLabel ?? title}
      className={mergedClassName}
      {...articleProps}
    >
      {inner}
    </article>
  );
}

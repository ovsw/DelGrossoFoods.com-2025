import { CartButton } from "./CartButton";
import { RecipesButton } from "./RecipesButton";

type DesktopActionsProps = {
  ctaButton?: {
    text: string;
    href: string;
    openInNewTab?: boolean | null;
    dataAttribute?: string | null;
  };
};

export function DesktopActions({ ctaButton }: DesktopActionsProps) {
  const hasCtaButton = Boolean(ctaButton?.text && ctaButton?.href);
  const ctaLabel = ctaButton?.text ?? "";
  const ctaHref = ctaButton?.href ?? "";
  const ctaLinkProps = hasCtaButton
    ? {
        ...(ctaButton?.openInNewTab
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {}),
        ...(ctaButton?.dataAttribute
          ? { "data-sanity": ctaButton.dataAttribute }
          : {}),
      }
    : {};

  return (
    <div className="hidden items-center space-x-4 lg:flex">
      {hasCtaButton ? (
        <RecipesButton size="sm" href={ctaHref} {...ctaLinkProps}>
          {ctaLabel}
        </RecipesButton>
      ) : null}
      <CartButton />
    </div>
  );
}

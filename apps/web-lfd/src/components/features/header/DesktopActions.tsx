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
  const ctaLabel = ctaButton?.text ?? "Recipes";
  const ctaHref = ctaButton?.href ?? "/recipes";
  const ctaLinkProps = {
    ...(ctaButton?.openInNewTab
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {}),
    ...(ctaButton?.dataAttribute
      ? { "data-sanity": ctaButton.dataAttribute }
      : {}),
  };

  return (
    <div className="hidden items-center space-x-4 lg:flex">
      <RecipesButton size="sm" href={ctaHref} {...ctaLinkProps}>
        {ctaLabel}
      </RecipesButton>
      <CartButton />
    </div>
  );
}

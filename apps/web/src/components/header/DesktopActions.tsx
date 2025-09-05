import { CartButton } from "./CartButton";
import { RecipesButton } from "./RecipesButton";

export function DesktopActions() {
  return (
    <div className="hidden items-center space-x-4 lg:flex">
      <RecipesButton variant="accent" size="sm" />
      <CartButton variant="outline" />
    </div>
  );
}

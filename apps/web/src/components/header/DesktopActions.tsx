import { Button } from "@workspace/ui/components/button";

import { CartButton } from "./CartButton";

export function DesktopActions() {
  return (
    <div className="hidden items-center space-x-4 lg:flex">
      <Button variant="outline" size="sm">
        Recipes
      </Button>
      <CartButton variant="secondary" />
    </div>
  );
}

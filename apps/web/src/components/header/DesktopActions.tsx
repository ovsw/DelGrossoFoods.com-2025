import { Button } from "@workspace/ui/components/button";

export function DesktopActions() {
  return (
    <div className="hidden items-center space-x-4 lg:flex">
      <Button variant="outline" size="sm">
        Recipes
      </Button>
      <Button variant="destructive" size="sm">
        Cart{" "}
        <span>
          (<span data-fc-id="minicart-quantity">0</span>)
        </span>
      </Button>
    </div>
  );
}

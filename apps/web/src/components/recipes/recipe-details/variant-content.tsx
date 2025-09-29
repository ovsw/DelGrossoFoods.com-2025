import { RichText } from "@/components/elements/rich-text";

import { hasBlocks } from "./utils";

export function VariantContent({
  ingredients,
  directions,
  notes,
}: {
  ingredients?: unknown[] | null;
  directions?: unknown[] | null;
  notes?: unknown[] | null;
}) {
  return (
    <div data-c="tab-content-wrapper" className="space-y-10">
      {/* Ingredients */}
      {hasBlocks(ingredients) ? (
        <section
          id="ingredients"
          className="space-y-4"
          aria-labelledby="ingredients-heading"
        >
          <h2
            id="ingredients-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
          >
            Ingredients
          </h2>
          <RichText richText={ingredients} className="mt-0" />
        </section>
      ) : null}

      {/* Directions */}
      {hasBlocks(directions) ? (
        <section
          id="directions"
          className="space-y-4"
          aria-labelledby="directions-heading"
        >
          <h2
            id="directions-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
          >
            Directions
          </h2>
          <RichText richText={directions} className="mt-0" />
        </section>
      ) : null}

      {/* Notes */}
      {hasBlocks(notes) ? (
        <section
          id="notes"
          className="space-y-4"
          aria-labelledby="notes-heading"
        >
          <h2
            id="notes-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
          >
            Notes
          </h2>
          <RichText richText={notes} className="mt-0" />
        </section>
      ) : null}
    </div>
  );
}

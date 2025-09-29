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
    <div data-html="c-variant-content" className="space-y-10">
      {/* Ingredients */}
      {hasBlocks(ingredients) ? (
        <section
          id="ingredients"
          className="space-y-4"
          aria-labelledby="ingredients-heading"
          data-html="c-ingredients-section"
        >
          <h2
            id="ingredients-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
            data-html="c-ingredients-heading"
          >
            Ingredients
          </h2>
          <RichText
            richText={ingredients}
            className="mt-0"
            data-html="c-ingredients-content"
          />
        </section>
      ) : null}

      {/* Directions */}
      {hasBlocks(directions) ? (
        <section
          id="directions"
          className="space-y-4"
          aria-labelledby="directions-heading"
          data-html="c-directions-section"
        >
          <h2
            id="directions-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
            data-html="c-directions-heading"
          >
            Directions
          </h2>
          <RichText
            richText={directions}
            className="mt-0"
            data-html="c-directions-content"
          />
        </section>
      ) : null}

      {/* Notes */}
      {hasBlocks(notes) ? (
        <section
          id="notes"
          className="space-y-4"
          aria-labelledby="notes-heading"
          data-html="c-notes-section"
        >
          <h2
            id="notes-heading"
            className="scroll-m-20 border-b border-muted-foreground/30 pb-2 text-3xl font-semibold first:mt-0"
            data-html="c-notes-heading"
          >
            Notes
          </h2>
          <RichText
            richText={notes}
            className="mt-0"
            data-html="c-notes-content"
          />
        </section>
      ) : null}
    </div>
  );
}

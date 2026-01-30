import { RichText } from "@/components/elements/rich-text";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";

import { hasBlocks } from "./utils";

type VariantFieldPaths = {
  ingredients?: string | null;
  directions?: string | null;
  notes?: string | null;
};

export function VariantContent({
  ingredients,
  directions,
  notes,
  documentId,
  documentType,
  fieldPaths,
}: {
  ingredients?: unknown[] | null;
  directions?: unknown[] | null;
  notes?: unknown[] | null;
  documentId?: string | null;
  documentType?: string | null;
  fieldPaths?: VariantFieldPaths;
}) {
  const getDataAttribute = (path?: string | null) =>
    createPresentationDataAttribute({
      documentId,
      documentType,
      path: path ?? null,
    }) ?? undefined;

  return (
    <div data-html="c-variant-content" className="space-y-10">
      {/* Ingredients */}
      {hasBlocks(ingredients) ? (
        <section
          id="ingredients"
          className="space-y-4"
          aria-labelledby="ingredients-heading"
          data-html="c-ingredients-section"
          data-sanity={getDataAttribute(fieldPaths?.ingredients)}
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
          data-sanity={getDataAttribute(fieldPaths?.directions)}
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
          data-sanity={getDataAttribute(fieldPaths?.notes)}
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

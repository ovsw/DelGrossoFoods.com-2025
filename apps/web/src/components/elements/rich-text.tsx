"use client";
import Link from "next/link";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextReactComponents,
} from "next-sanity";

import { parseChildrenToSlug } from "@/utils";

import { Prose } from "./prose";
import { SanityImage } from "./sanity-image";

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return <h2 id={slug}>{children}</h2>;
    },
    h3: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return <h3 id={slug}>{children}</h3>;
    },
    h4: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return <h4 id={slug}>{children}</h4>;
    },
    h5: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return <h5 id={slug}>{children}</h5>;
    },
    h6: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children);
      return <h6 id={slug}>{children}</h6>;
    },
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded-md border border-border bg-muted px-1 py-0.5 text-sm lg:whitespace-nowrap">
        {children}
      </code>
    ),
    customLink: ({ children, value }) => {
      if (!value.href || value.href === "#") {
        console.warn("🚀 link is not set", value);
        return <span>Link Broken</span>;
      }
      return (
        <Link
          href={value.href}
          prefetch={false}
          aria-label={`Link to ${value?.href}`}
          target={value.openInNewTab ? "_blank" : "_self"}
          rel={value.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.id) return null;
      return (
        <figure className="my-4">
          <SanityImage
            image={value}
            className="h-auto rounded-lg w-full"
            width={1600}
            height={900}
          />
          {value?.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  hardBreak: () => <br />,
};

export function RichText<T>({
  richText,
  className,
}: {
  richText?: T | null;
  className?: string;
}) {
  if (!richText) return null;

  return (
    <Prose className={className}>
      <PortableText
        // The next-sanity PortableText expects PortableTextBlock[] by default.
        // Our generated GROQ types allow some fields to be optional/null, which
        // is compatible at runtime but stricter in TypeScript. Cast to the
        // runtime-compatible type to satisfy the compiler without weakening
        // upstream types across the codebase.
        value={richText as unknown as PortableTextBlock[]}
        components={components}
        onMissingComponent={(_, { nodeType, type }) =>
          console.log("missing component", nodeType, type)
        }
      />
    </Prose>
  );
}

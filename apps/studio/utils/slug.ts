import {
  defineField,
  type FieldDefinition,
  getDraftId,
  getPublishedId,
  type SlugifierFn,
  type SlugValidationContext,
} from "sanity";
import slugify from "slugify";

import type { PathnameParams } from "./types";

export function defineSlug(
  schema: PathnameParams = { name: "slug" },
): FieldDefinition<"slug"> {
  const slugOptions = schema?.options;

  return defineField({
    ...schema,
    name: schema.name ?? "slug",
    title: schema?.title ?? "URL",
    type: "slug",
    components: {
      ...schema.components,
      // field: schema.components?.field ?? PathnameFieldComponent,
    },
    options: {
      ...(slugOptions ?? {}),
      isUnique: slugOptions?.isUnique ?? isUnique,
    },
  });
}

export async function isUnique(
  slug: string,
  context: SlugValidationContext,
): Promise<boolean> {
  const { document, getClient } = context;
  const client = getClient({ apiVersion: "2025-02-10" });
  const id = getPublishedId(document?._id ?? "");
  const draftId = getDraftId(id);
  const params = {
    draft: draftId,
    published: id,
    slug,
  };
  const query = "*[!(_id in [$draft, $published]) && slug.current == $slug]";
  const result = await client.fetch(query, params);
  return result.length === 0;
}

export const getDocTypePrefix = (type: string) => {
  if (["page"].includes(type)) return "";
  if (type === "sauce") return "sauces";
  if (type === "product") return "products";
  if (type === "recipe") return "recipes";
  return type;
};

type SlugMapValue =
  | string
  | ((
      input: string,
      parent: { _type?: string } | undefined,
    ) => string | undefined | null);

const slugMapper: Record<string, SlugMapValue> = {
  homePage: "/",
  blogIndex: "/blog",
  sauceIndex: "/sauces",
  productIndex: "/products",
  recipeIndex: "/recipes",
};

function normalizePath(path: string): string {
  if (!path) return "/";
  // Ensure string and trim whitespace
  let p = String(path).trim();
  // Guarantee leading slash
  if (!p.startsWith("/")) p = `/${p}`;
  // Collapse multiple slashes
  p = p.replace(/\/+/, "/");
  // Remove trailing slash unless root
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

export const createSlug: SlugifierFn = (input, _, { parent }) => {
  const { _type } = (parent || {}) as { _type?: string };

  const map = _type ? slugMapper[_type] : undefined;
  if (typeof map === "function") {
    const computed = map(input, parent as any);
    if (typeof computed === "string" && computed.trim().length > 0) {
      return normalizePath(computed);
    }
    // fall through to default generation if mapper returned invalid
  } else if (typeof map === "string") {
    const mapped = map.trim();
    // If mapper string ends with '/', treat as a prefix to compose
    if (mapped.endsWith("/")) {
      const base = mapped;
      const seg = slugify(input, { lower: true, remove: /[^a-zA-Z0-9 ]/g });
      return normalizePath(`${base}${seg}`);
    }
    // Otherwise treat as an absolute, fixed path (preserves current index behavior)
    return normalizePath(mapped);
  }

  const prefix = getDocTypePrefix(_type || "");
  const seg = slugify(input, {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
  });

  const joined = `/${[prefix, seg].filter(Boolean).join("/")}`;
  return normalizePath(joined);
};

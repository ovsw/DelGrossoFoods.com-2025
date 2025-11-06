/**
 * One-time slug backfill for product and recipe documents.
 *
 * Usage (dry run first):
 *   pnpm --filter studio-dgf sanity exec scripts/backfill-slugs.ts -- --dry
 *
 * Apply changes:
 *   pnpm --filter studio-dgf sanity exec scripts/backfill-slugs.ts -- --with-user-token
 *
 * Options:
 *   --dry               Preview changes without writing
 *   --types=a,b         Comma-separated doc types to process (default: product,recipe)
 *   --fix-prefix        Also fix existing slugs with wrong prefix
 *   --limit=N           Limit number of documents to process
 */

import "dotenv/config";

import {
  createSlug,
  getDocTypePrefix,
} from "@workspace/sanity-schema/utils/slug";
import type { SlugSchemaType } from "sanity";
import { getCliClient } from "sanity/cli";

type DocType = "product" | "recipe";

interface Doc {
  _id: string;
  _type: DocType;
  name?: string;
  title?: string;
  slug?: { current?: string };
}

const apiVersion = "2025-02-19";

function parseArgs(argv: string[]) {
  const args = new Set(argv);
  const getValue = (key: string) => {
    const idx = argv.indexOf(key);
    return idx >= 0 ? argv[idx + 1] : undefined;
  };

  const dry = args.has("--dry") || args.has("--dry-run");
  const typesArg = getValue("--types");
  const types = (typesArg?.split(",").map((t) => t.trim()) || [
    "product",
    "recipe",
  ]) as DocType[];
  const limit = getValue("--limit");
  const fixPrefix = args.has("--fix-prefix");

  return { dry, types, limit: limit ? Number(limit) : undefined, fixPrefix };
}

function toPublishedId(id: string): string {
  return id.replace(/^drafts\./, "");
}

function toDraftId(id: string): string {
  return id.startsWith("drafts.") ? id : `drafts.${id}`;
}

function hasCorrectPrefix(slug: string | undefined, type: DocType): boolean {
  if (!slug) return false;
  const expected = `/${getDocTypePrefix(type)}/`;
  return slug.startsWith(expected);
}

async function slugExists(
  client: any,
  slug: string,
  excludeBaseId: string,
): Promise<boolean> {
  const params = {
    slug,
    draft: `drafts.${excludeBaseId}`,
    published: excludeBaseId,
  };
  const query = `*[
    slug.current == $slug && !(_id in [$draft, $published])
  ][0]._id`;
  const dup = (await client.fetch(query, params)) as string | null;
  return Boolean(dup);
}

async function ensureUniqueSlug(
  client: any,
  baseSlug: string,
  baseId: string,
): Promise<string> {
  // If unused, return as-is
  if (!(await slugExists(client, baseSlug, baseId))) return baseSlug;

  const lastSlash = baseSlug.lastIndexOf("/");
  const prefix = baseSlug.slice(0, lastSlash + 1); // includes trailing /
  const segment = baseSlug.slice(lastSlash + 1);

  let n = 2;
  while (true) {
    const candidate = `${prefix}${segment}-${n}`;
    if (!(await slugExists(client, candidate, baseId))) return candidate;
    n++;
  }
}

function deriveSourceValue(doc: Doc): string | undefined {
  // Our schemas use `name` for product/recipe
  return doc.name || doc.title;
}

async function generateSlugForDoc(doc: Doc): Promise<string | undefined> {
  const source = deriveSourceValue(doc);
  if (!source) return undefined;
  // Reuse the studio slugifier to maintain identical output
  const slugFn = createSlug as unknown as (
    input: string,
    type: SlugSchemaType,
    context: { parent?: unknown },
  ) => string | Promise<string>;
  const out = slugFn(source, undefined as unknown as SlugSchemaType, {
    parent: { _type: doc._type },
  });
  return out instanceof Promise ? await out : out;
}

async function backfill() {
  const { dry, types, limit, fixPrefix } = parseArgs(process.argv.slice(2));
  const baseClient = getCliClient({ apiVersion });
  const token =
    process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  const client = token ? baseClient.withConfig({ token }) : baseClient;

  if (!token) {
    console.log(
      "[auth] No SANITY_AUTH_TOKEN/SANITY_API_WRITE_TOKEN found; relying on CLI user token if provided (use --with-user-token) or set a write token.",
    );
  } else {
    console.log("[auth] Using service API token from environment.");
  }

  console.log(
    `Running slug backfill (dry=${dry}) for types: ${types.join(", ")}`,
  );

  // Only fetch published docs to avoid duplicates; we'll patch draft too if it exists.
  const query = `*[_type in $types && !(_id match "drafts.*")]{_id,_type,name,title,slug}`;
  let docs = (await client.fetch(query, { types })) as Doc[];

  // Filter docs needing attention
  docs = docs.filter((d) => {
    const missing = !d.slug?.current || d.slug.current.trim() === "";
    const wrongPrefix =
      !missing && fixPrefix && !hasCorrectPrefix(d.slug?.current, d._type);
    return missing || wrongPrefix;
  });

  if (limit && Number.isFinite(limit)) docs = docs.slice(0, limit);

  if (docs.length === 0) {
    console.log("No documents require slug backfill.");
    return;
  }

  console.log(`Found ${docs.length} documents to update.`);

  let updated = 0;
  for (const doc of docs) {
    const baseId = toPublishedId(doc._id);
    const suggested = await generateSlugForDoc(doc);
    if (!suggested) {
      console.warn(
        `Skipping ${doc._id} (${doc._type}): missing source (name/title).`,
      );
      continue;
    }

    const finalSlug = await ensureUniqueSlug(client, suggested, baseId);

    if (dry) {
      console.log(
        `DRY: ${doc._id} (${doc._type}) -> ${doc.slug?.current ?? "<none>"} => ${finalSlug}`,
      );
      continue;
    }

    // Always patch published; patch draft only if it exists
    const patchPublished = client
      .patch(baseId)
      .set({ slug: { _type: "slug", current: finalSlug } });

    const draftId = toDraftId(baseId);
    const hasDraft = (await client.fetch("defined(*[_id == $id][0]._id)", {
      id: draftId,
    })) as boolean;

    const tx = client.transaction().patch(patchPublished);
    if (hasDraft) {
      tx.patch(
        client
          .patch(draftId)
          .set({ slug: { _type: "slug", current: finalSlug } }),
      );
    }
    await tx.commit({ visibility: "async" });

    updated++;
    console.log(`Updated ${doc._id} -> ${finalSlug}`);
  }

  console.log(`Done. Updated ${updated} document(s).`);
}

backfill().catch((err) => {
  console.error(err);
  process.exit(1);
});

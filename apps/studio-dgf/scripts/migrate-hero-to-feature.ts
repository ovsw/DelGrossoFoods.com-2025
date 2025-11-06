/**
 * One-time migration to rename page builder "Hero" blocks to "Feature".
 *
 * Always run a dry run first:
 *   pnpm --filter studio-dgf sanity exec scripts/migrate-hero-to-feature.ts -- --dry
 *
 * Apply the migration (requires write token or --with-user-token):
 *   pnpm --filter studio-dgf sanity exec scripts/migrate-hero-to-feature.ts -- --with-user-token
 */

import "dotenv/config";

import { getCliClient } from "sanity/cli";

const apiVersion = "2025-05-08";
const DEFAULT_TYPES = [
  "homePage",
  "page",
  "productIndex",
  "recipeIndex",
  "sauceIndex",
  "blogIndex",
] as const;

type PortableDocType = (typeof DEFAULT_TYPES)[number];

interface MigrationDoc {
  _id: string;
  _type: PortableDocType;
  blocks: { _key: string }[];
}

interface CliOptions {
  dry: boolean;
  limit?: number;
  types: PortableDocType[];
}

function parseArgs(argv: string[]): CliOptions {
  const args = new Set(argv);
  const getValue = (flag: string) => {
    const idx = argv.indexOf(flag);
    return idx >= 0 ? argv[idx + 1] : undefined;
  };

  const dry = args.has("--dry") || args.has("--dry-run");
  const limitParam = getValue("--limit");
  const typesParam = getValue("--types");

  const types = typesParam
    ? (typesParam
        .split(",")
        .map((item) => item.trim())
        .filter((item): item is PortableDocType =>
          (DEFAULT_TYPES as readonly string[]).includes(item),
        ) as PortableDocType[])
    : [...DEFAULT_TYPES];

  return {
    dry,
    limit: limitParam ? Number(limitParam) : undefined,
    types,
  };
}

function toPublishedId(id: string): string {
  return id.replace(/^drafts\./, "");
}

function toDraftId(id: string): string {
  return id.startsWith("drafts.") ? id : `drafts.${id}`;
}

async function migrate() {
  const options = parseArgs(process.argv.slice(2));
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
    `Scanning for hero blocks (dry=${options.dry}) in types: ${options.types.join(", ")}`,
  );

  const docs = (await client.fetch(
    `*[_type in $types && defined(pageBuilder) && count(pageBuilder[_type == "hero"]) > 0]{
      _id,
      _type,
      "blocks": pageBuilder[_type == "hero"]{ _key }
    }` as const,
    { types: options.types },
  )) as MigrationDoc[];

  if (!docs.length) {
    console.log("No hero blocks found. Migration not required.");
    return;
  }

  const limitedDocs = options.limit
    ? docs.slice(0, Math.max(0, options.limit))
    : docs;

  console.log(
    `Found ${docs.length} documents containing hero blocks.` +
      (options.limit && docs.length > limitedDocs.length
        ? ` Processing first ${limitedDocs.length} due to --limit.`
        : ""),
  );

  let processed = 0;
  let updatedBlocks = 0;

  for (const doc of limitedDocs) {
    const blockKeys = doc.blocks.map((block) => block._key);

    if (options.dry) {
      console.log(`DRY: ${doc._id} (${doc._type}) -> ${blockKeys.join(", ")}`);
      processed += 1;
      updatedBlocks += blockKeys.length;
      continue;
    }

    const baseId = toPublishedId(doc._id);
    const draftId = toDraftId(baseId);

    const setOps = blockKeys.reduce<Record<string, string>>((acc, key) => {
      acc[`pageBuilder[_key=="${key}"]._type`] = "feature";
      return acc;
    }, {});

    const tx = client.transaction().patch(client.patch(baseId).set(setOps));

    const hasDraft = (await client.fetch("defined(*[_id == $id][0]._id)", {
      id: draftId,
    })) as boolean;

    if (hasDraft) {
      tx.patch(client.patch(draftId).set(setOps));
    }

    await tx.commit();

    console.log(
      `Updated ${doc._id} (${doc._type}): ${blockKeys.length} block(s) renamed`,
    );

    processed += 1;
    updatedBlocks += blockKeys.length;
  }

  console.log(
    options.dry
      ? `Dry run complete. ${processed} document(s) would be updated (${updatedBlocks} block(s)).`
      : `Migration complete. Updated ${processed} document(s) and ${updatedBlocks} block(s).`,
  );
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

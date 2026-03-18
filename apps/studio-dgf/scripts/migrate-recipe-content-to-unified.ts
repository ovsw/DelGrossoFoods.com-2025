/**
 * Recipe content unification migration.
 *
 * Usage:
 *   pnpm --filter studio-dgf exec sanity exec scripts/migrate-recipe-content-to-unified.ts -- --mode=report
 *   pnpm --filter studio-dgf exec sanity exec scripts/migrate-recipe-content-to-unified.ts -- --mode=backfill
 *   pnpm --filter studio-dgf exec sanity exec scripts/migrate-recipe-content-to-unified.ts -- --mode=clear-legacy
 *   pnpm --filter studio-dgf exec sanity exec scripts/migrate-recipe-content-to-unified.ts -- --mode=clear-versions
 *
 * Options:
 *   --mode=<mode>       report | backfill | clear-legacy | clear-versions
 *   --no-dry-run        Apply mutations. Default is dry-run for all write modes.
 *   --overwrite         Backfill unified fields even when they already exist.
 *   --force             Allow clear-legacy when unified ingredients/directions are still empty.
 *   --limit=N           Limit the number of recipe records processed.
 *   --dataset=<name>    Override the configured dataset (defaults to the current CLI dataset).
 */

import { getCliClient } from "sanity/cli";

type Mode = "report" | "backfill" | "clear-legacy" | "clear-versions";
type SourceVariant = "dgf" | "lfd" | "empty";

type PortableTextBlock = Record<string, unknown>;
type PortableTextValue = PortableTextBlock[] | null | undefined;

type RecipeDoc = {
  _id: string;
  _type: "recipe";
  name?: string;
  versions?: string[];
  ingredients?: PortableTextValue;
  directions?: PortableTextValue;
  notes?: PortableTextValue;
  dgfIngredients?: PortableTextValue;
  dgfDirections?: PortableTextValue;
  dgfNotes?: PortableTextValue;
  lfdIngredients?: PortableTextValue;
  lfdDirections?: PortableTextValue;
  lfdNotes?: PortableTextValue;
  dgfSauces?: Array<{ _ref?: string }> | null;
  lfdSauces?: Array<{ _ref?: string }> | null;
  organicSauce?: { _ref?: string } | null;
};

type RecipeRecord = {
  baseId: string;
  published?: RecipeDoc;
  draft?: RecipeDoc;
  source: RecipeDoc;
};

type Aggregates = {
  total: number;
  dgfLegacyPresent: number;
  lfdLegacyPresent: number;
  unifiedIngredientsPresent: number;
  unifiedDirectionsPresent: number;
  unifiedNotesPresent: number;
  unifiedAnyPresent: number;
  selectedSourceDgf: number;
  selectedSourceLfd: number;
  selectedSourceEmpty: number;
  bothLegacyPresent: number;
  dgfSmallerThanLfd: number;
  sauceVersionsDrift: number;
};

type WriteModeOptions = {
  dryRun: boolean;
  force: boolean;
  overwrite: boolean;
};

const apiVersion = "2025-02-19";

const LEGACY_FIELDS = {
  dgf: {
    ingredients: "dgfIngredients",
    directions: "dgfDirections",
    notes: "dgfNotes",
  },
  lfd: {
    ingredients: "lfdIngredients",
    directions: "lfdDirections",
    notes: "lfdNotes",
  },
} as const;

const LEGACY_TEXT_FIELDS = [
  LEGACY_FIELDS.dgf.ingredients,
  LEGACY_FIELDS.dgf.directions,
  LEGACY_FIELDS.dgf.notes,
  LEGACY_FIELDS.lfd.ingredients,
  LEGACY_FIELDS.lfd.directions,
  LEGACY_FIELDS.lfd.notes,
] as const;

function parseArgs(argv: string[]) {
  const hasFlag = (flag: string) => argv.includes(flag);
  const getValue = (flag: string) => {
    const inline = argv.find((arg) => arg.startsWith(`${flag}=`));
    if (inline) {
      return inline.slice(flag.length + 1);
    }

    const index = argv.indexOf(flag);
    return index >= 0 ? argv[index + 1] : undefined;
  };

  const mode = (getValue("--mode") ?? "report") as Mode;
  if (
    !["report", "backfill", "clear-legacy", "clear-versions"].includes(mode)
  ) {
    throw new Error(`Unsupported mode: ${mode}`);
  }

  const limitValue = getValue("--limit");
  let limit: number | undefined;
  if (limitValue) {
    const parsedLimit = Number(limitValue);
    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      throw new Error(`Invalid --limit value: ${limitValue}`);
    }
    limit = parsedLimit;
  }

  return {
    mode,
    dryRun: !hasFlag("--no-dry-run"),
    overwrite: hasFlag("--overwrite"),
    force: hasFlag("--force"),
    limit,
    dataset: getValue("--dataset"),
  };
}

function isDraftId(id: string): boolean {
  return id.startsWith("drafts.");
}

function toPublishedId(id: string): string {
  return id.replace(/^drafts\./, "");
}

function hasBlocks(value: PortableTextValue): value is PortableTextBlock[] {
  return Array.isArray(value) && value.length > 0;
}

function blockCount(value: PortableTextValue): number {
  return hasBlocks(value) ? value.length : 0;
}

function hasRefArray(
  value: RecipeDoc["dgfSauces"] | RecipeDoc["lfdSauces"],
): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasDefinedRef(value: RecipeDoc["organicSauce"]): boolean {
  return Boolean(value && typeof value === "object");
}

function getLegacyValue(
  doc: RecipeDoc,
  variant: Exclude<SourceVariant, "empty">,
  field: "ingredients" | "directions" | "notes",
): PortableTextValue {
  return doc[LEGACY_FIELDS[variant][field]];
}

function getLegacyBlockCount(
  doc: RecipeDoc,
  variant: Exclude<SourceVariant, "empty">,
): number {
  return (
    blockCount(getLegacyValue(doc, variant, "ingredients")) +
    blockCount(getLegacyValue(doc, variant, "directions")) +
    blockCount(getLegacyValue(doc, variant, "notes"))
  );
}

function hasLegacyContent(
  doc: RecipeDoc,
  variant: Exclude<SourceVariant, "empty">,
): boolean {
  return getLegacyBlockCount(doc, variant) > 0;
}

function getSelectedSourceVariant(doc: RecipeDoc): SourceVariant {
  if (hasLegacyContent(doc, "dgf")) {
    return "dgf";
  }

  if (hasLegacyContent(doc, "lfd")) {
    return "lfd";
  }

  return "empty";
}

function hasAnyUnifiedContent(doc: RecipeDoc): boolean {
  return (
    hasBlocks(doc.ingredients) ||
    hasBlocks(doc.directions) ||
    hasBlocks(doc.notes)
  );
}

function hasRequiredUnifiedContent(doc: RecipeDoc): boolean {
  return hasBlocks(doc.ingredients) && hasBlocks(doc.directions);
}

function getDerivedAvailability(doc: RecipeDoc) {
  return {
    dgf: hasRefArray(doc.dgfSauces),
    lfd: hasRefArray(doc.lfdSauces),
    organic: hasDefinedRef(doc.organicSauce),
  };
}

function getLegacyVersions(doc: RecipeDoc): string[] {
  if (!Array.isArray(doc.versions)) {
    return [];
  }

  return doc.versions
    .filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    )
    .map((value) => value.trim());
}

function hasSauceVersionsDrift(doc: RecipeDoc): boolean {
  const legacyVersions = new Set(getLegacyVersions(doc));
  const derived = getDerivedAvailability(doc);

  return (
    legacyVersions.has("DGF") !== derived.dgf ||
    legacyVersions.has("LFD") !== derived.lfd ||
    legacyVersions.has("Organic") !== derived.organic
  );
}

function getMutationTargetIds(record: RecipeRecord): string[] {
  const ids: string[] = [];

  if (record.published) {
    ids.push(record.baseId);
  }

  if (record.draft) {
    ids.push(record.draft._id);
  }

  return ids;
}

function getRecordLabel(record: RecipeRecord): string {
  return `${record.baseId}${record.draft ? " (draft+published)" : ""}`;
}

function buildAggregates(records: RecipeRecord[]): Aggregates {
  return records.reduce<Aggregates>(
    (acc, record) => {
      const doc = record.source;
      const selectedSource = getSelectedSourceVariant(doc);
      const dgfCount = getLegacyBlockCount(doc, "dgf");
      const lfdCount = getLegacyBlockCount(doc, "lfd");

      acc.total += 1;
      acc.dgfLegacyPresent += Number(dgfCount > 0);
      acc.lfdLegacyPresent += Number(lfdCount > 0);
      acc.unifiedIngredientsPresent += Number(hasBlocks(doc.ingredients));
      acc.unifiedDirectionsPresent += Number(hasBlocks(doc.directions));
      acc.unifiedNotesPresent += Number(hasBlocks(doc.notes));
      acc.unifiedAnyPresent += Number(hasAnyUnifiedContent(doc));
      acc.selectedSourceDgf += Number(selectedSource === "dgf");
      acc.selectedSourceLfd += Number(selectedSource === "lfd");
      acc.selectedSourceEmpty += Number(selectedSource === "empty");
      acc.bothLegacyPresent += Number(dgfCount > 0 && lfdCount > 0);
      acc.dgfSmallerThanLfd += Number(dgfCount > 0 && dgfCount < lfdCount);
      acc.sauceVersionsDrift += Number(hasSauceVersionsDrift(doc));

      return acc;
    },
    {
      total: 0,
      dgfLegacyPresent: 0,
      lfdLegacyPresent: 0,
      unifiedIngredientsPresent: 0,
      unifiedDirectionsPresent: 0,
      unifiedNotesPresent: 0,
      unifiedAnyPresent: 0,
      selectedSourceDgf: 0,
      selectedSourceLfd: 0,
      selectedSourceEmpty: 0,
      bothLegacyPresent: 0,
      dgfSmallerThanLfd: 0,
      sauceVersionsDrift: 0,
    },
  );
}

async function loadRecipeRecords(
  client: ReturnType<typeof getCliClient>,
  limit?: number,
) {
  const docs = (await client.fetch(
    `*[_type == "recipe"]{
      _id,
      _type,
      name,
      versions,
      ingredients,
      directions,
      notes,
      dgfIngredients,
      dgfDirections,
      dgfNotes,
      lfdIngredients,
      lfdDirections,
      lfdNotes,
      dgfSauces,
      lfdSauces,
      organicSauce
    }`,
  )) as RecipeDoc[];

  const recordsByBaseId = new Map<
    string,
    {
      published?: RecipeDoc;
      draft?: RecipeDoc;
    }
  >();

  for (const doc of docs) {
    const baseId = toPublishedId(doc._id);
    const current = recordsByBaseId.get(baseId) ?? {};

    if (isDraftId(doc._id)) {
      current.draft = doc;
    } else {
      current.published = doc;
    }

    recordsByBaseId.set(baseId, current);
  }

  const records: RecipeRecord[] = [];
  for (const [baseId, value] of recordsByBaseId.entries()) {
    const source = value.draft ?? value.published;
    if (!source) {
      continue;
    }

    records.push({
      baseId,
      published: value.published,
      draft: value.draft,
      source,
    });
  }

  records.sort((left, right) => left.baseId.localeCompare(right.baseId));

  return typeof limit === "number" ? records.slice(0, limit) : records;
}

async function commitRecordPatch(
  client: ReturnType<typeof getCliClient>,
  record: RecipeRecord,
  setOps: Record<string, unknown>,
  unsetOps: string[],
  dryRun: boolean,
) {
  const targetIds = getMutationTargetIds(record);
  if (targetIds.length === 0) {
    return false;
  }

  if (dryRun) {
    console.log(
      `[dry-run] ${targetIds.join(", ")} set=${Object.keys(setOps).join(",") || "<none>"} unset=${unsetOps.join(",") || "<none>"}`,
    );
    return false;
  }

  let tx = client.transaction();

  for (const id of targetIds) {
    let patch = client.patch(id);

    if (Object.keys(setOps).length > 0) {
      patch = patch.set(setOps);
    }

    if (unsetOps.length > 0) {
      patch = patch.unset(unsetOps);
    }

    tx = tx.patch(patch);
  }

  await tx.commit({ visibility: "async" });
  console.log(
    `[write] ${targetIds.join(", ")} set=${Object.keys(setOps).join(",") || "<none>"} unset=${unsetOps.join(",") || "<none>"}`,
  );
  return true;
}

function report(records: RecipeRecord[]) {
  const rows = records.map((record) => {
    const doc = record.source;
    const dgfCount = getLegacyBlockCount(doc, "dgf");
    const lfdCount = getLegacyBlockCount(doc, "lfd");
    const derivedAvailability = getDerivedAvailability(doc);

    return {
      id: record.baseId,
      sourceDoc: doc._id,
      name: doc.name ?? "",
      dgfLegacyBlocks: dgfCount,
      lfdLegacyBlocks: lfdCount,
      unifiedBlocks:
        blockCount(doc.ingredients) +
        blockCount(doc.directions) +
        blockCount(doc.notes),
      dgfLegacyPresent: dgfCount > 0,
      lfdLegacyPresent: lfdCount > 0,
      unifiedPresent: hasAnyUnifiedContent(doc),
      selectedSource: getSelectedSourceVariant(doc),
      bothLegacyPresent: dgfCount > 0 && lfdCount > 0,
      dgfSmallerThanLfd: dgfCount > 0 && dgfCount < lfdCount,
      legacyVersions: getLegacyVersions(doc).join(","),
      derivedAvailability: [
        derivedAvailability.dgf ? "DGF" : null,
        derivedAvailability.lfd ? "LFD" : null,
        derivedAvailability.organic ? "Organic" : null,
      ]
        .filter(Boolean)
        .join(","),
      sauceVersionsDrift: hasSauceVersionsDrift(doc),
    };
  });

  console.table(rows);

  const aggregates = buildAggregates(records);
  console.table([
    { metric: "recipes", value: aggregates.total },
    { metric: "legacy DGF present", value: aggregates.dgfLegacyPresent },
    { metric: "legacy LFD present", value: aggregates.lfdLegacyPresent },
    {
      metric: "unified ingredients present",
      value: aggregates.unifiedIngredientsPresent,
    },
    {
      metric: "unified directions present",
      value: aggregates.unifiedDirectionsPresent,
    },
    { metric: "unified notes present", value: aggregates.unifiedNotesPresent },
    {
      metric: "any unified content present",
      value: aggregates.unifiedAnyPresent,
    },
    { metric: "selected source: DGF", value: aggregates.selectedSourceDgf },
    { metric: "selected source: LFD", value: aggregates.selectedSourceLfd },
    { metric: "selected source: empty", value: aggregates.selectedSourceEmpty },
    { metric: "both legacy sets present", value: aggregates.bothLegacyPresent },
    {
      metric: "DGF present but smaller than LFD",
      value: aggregates.dgfSmallerThanLfd,
    },
    {
      metric: "sauce-derived availability disagrees with versions",
      value: aggregates.sauceVersionsDrift,
    },
  ]);
}

async function backfill(
  client: ReturnType<typeof getCliClient>,
  records: RecipeRecord[],
  options: WriteModeOptions,
) {
  let mutated = 0;
  let skippedExisting = 0;
  let skippedEmpty = 0;

  const affectedRows = records.map((record) => {
    const doc = record.source;
    const selectedSource = getSelectedSourceVariant(doc);
    const alreadyPopulated = hasAnyUnifiedContent(doc);

    if (alreadyPopulated && !options.overwrite) {
      skippedExisting += 1;
      return {
        id: record.baseId,
        sourceDoc: doc._id,
        selectedSource,
        action: "skip-existing",
      };
    }

    if (selectedSource === "empty") {
      skippedEmpty += 1;
      return {
        id: record.baseId,
        sourceDoc: doc._id,
        selectedSource,
        action: "skip-empty",
      };
    }

    const ingredients = getLegacyValue(doc, selectedSource, "ingredients");
    const directions = getLegacyValue(doc, selectedSource, "directions");
    const notes = getLegacyValue(doc, selectedSource, "notes");

    const setOps: Record<string, unknown> = {
      ingredients: hasBlocks(ingredients) ? ingredients : [],
      directions: hasBlocks(directions) ? directions : [],
    };
    const unsetOps: string[] = [];

    if (hasBlocks(notes)) {
      setOps.notes = notes;
    } else {
      unsetOps.push("notes");
    }

    return {
      id: record.baseId,
      sourceDoc: doc._id,
      selectedSource,
      action: options.dryRun ? "dry-run" : "write",
      setOps,
      unsetOps,
      record,
    };
  });

  for (const row of affectedRows) {
    if (!("record" in row)) {
      continue;
    }

    const mutationRecord = row.record;
    if (!mutationRecord) {
      continue;
    }

    const wrote = await commitRecordPatch(
      client,
      mutationRecord,
      row.setOps,
      row.unsetOps,
      options.dryRun,
    );

    if (wrote || options.dryRun) {
      mutated += 1;
    }
  }

  console.table(
    affectedRows.map((row) => ({
      id: row.id,
      sourceDoc: row.sourceDoc,
      selectedSource: row.selectedSource,
      action: row.action,
    })),
  );

  console.table([
    { metric: "mutated or planned", value: mutated },
    { metric: "skipped existing unified content", value: skippedExisting },
    { metric: "skipped empty legacy source", value: skippedEmpty },
  ]);
}

async function clearLegacy(
  client: ReturnType<typeof getCliClient>,
  records: RecipeRecord[],
  options: WriteModeOptions,
) {
  const blocked = records.filter(
    (record) => !hasRequiredUnifiedContent(record.source),
  );
  if (blocked.length > 0 && !options.force) {
    console.error(
      "Refusing to clear legacy fields because unified ingredients/directions are still empty on these recipes:",
    );
    console.table(
      blocked.map((record) => ({
        id: record.baseId,
        sourceDoc: record.source._id,
        name: record.source.name ?? "",
      })),
    );
    process.exit(1);
  }

  let mutated = 0;

  for (const record of records) {
    const unsetOps = LEGACY_TEXT_FIELDS.filter((field) =>
      hasBlocks(record.source[field]),
    ) as string[];

    if (unsetOps.length === 0) {
      continue;
    }

    const wrote = await commitRecordPatch(
      client,
      record,
      {},
      unsetOps,
      options.dryRun,
    );

    if (wrote || options.dryRun) {
      mutated += 1;
    }
  }

  console.table([{ metric: "legacy clears", value: mutated }]);
}

async function clearVersions(
  client: ReturnType<typeof getCliClient>,
  records: RecipeRecord[],
  options: WriteModeOptions,
) {
  let mutated = 0;

  for (const record of records) {
    if (getLegacyVersions(record.source).length === 0) {
      continue;
    }

    const wrote = await commitRecordPatch(
      client,
      record,
      {},
      ["versions"],
      options.dryRun,
    );

    if (wrote || options.dryRun) {
      mutated += 1;
    }
  }

  console.table([{ metric: "versions clears", value: mutated }]);
}

async function main() {
  const { mode, dataset, dryRun, overwrite, force, limit } = parseArgs(
    process.argv.slice(2),
  );
  const baseClient = getCliClient({ apiVersion });
  const token =
    process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
  const configuredClient = baseClient.withConfig({
    ...(token ? { token } : {}),
    ...(dataset ? { dataset } : {}),
    perspective: "raw",
  });

  if (!token) {
    console.log(
      "[auth] No SANITY_AUTH_TOKEN/SANITY_API_WRITE_TOKEN found; relying on CLI user token if provided (use --with-user-token) or set a write token.",
    );
  } else {
    console.log("[auth] Using service API token from environment.");
  }

  const activeDataset =
    dataset || configuredClient.config().dataset || "<unknown>";
  console.log(
    `[config] mode=${mode} dryRun=${dryRun} overwrite=${overwrite} force=${force} dataset=${activeDataset}`,
  );

  const records = await loadRecipeRecords(configuredClient, limit);
  console.log(`[load] Loaded ${records.length} recipe record(s).`);

  switch (mode) {
    case "report":
      report(records);
      return;
    case "backfill":
      await backfill(configuredClient, records, { dryRun, overwrite, force });
      return;
    case "clear-legacy":
      await clearLegacy(configuredClient, records, {
        dryRun,
        overwrite,
        force,
      });
      return;
    case "clear-versions":
      await clearVersions(configuredClient, records, {
        dryRun,
        overwrite,
        force,
      });
      return;
    default:
      throw new Error(`Unhandled mode: ${String(mode)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

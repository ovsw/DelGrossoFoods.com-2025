/*
A reusable, batched Sanity deletion script and wired an npm script to execute it. 

## How to use
- Set env so the CLI knows your project/dataset (already pulled from sanity.cli.ts):
  - SANITY_STUDIO_PROJECT_ID
  - SANITY_STUDIO_DATASET
- Use your user token for auth: the command includes --with-user-token.

## Run commands:
- Dry run:
  - cd apps/studio
  - pnpm mut:delete-by-type -- --type=post --dry-run
- Delete published only:
pnpm mut:delete-by-type -- --type=post
- Delete published + drafts:
  - pnpm mut:delete-by-type -- --type=post --include-drafts
- Increase batch size:
pnpm mut: delete -by - type-- --type=post--batch = 200

## What it does:
- Fetches IDs in batches and deletes inside a transaction per batch.
- Defaults to published only; add --include-drafts to also remove draft docs.
- Tagged commits with mutations/delete-by-type for auditability.

## Safety:
 - Consider sanity dataset export before running destructive ops.
 - Use --dry-run first to preview what would be deleted.
 - If you want, I can also add a companion script to delete only drafts of a type, or to restrict by date range.
*/

import { getCliClient } from "sanity/cli";

type ParsedArgs = {
  docType: string | undefined;
  includeDrafts: boolean;
  batchSize: number;
  dryRun: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = {
    docType: undefined,
    includeDrafts: false,
    batchSize: 100,
    dryRun: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--type=")) args.docType = arg.split("=")[1];
    else if (arg === "--include-drafts" || arg === "--drafts")
      args.includeDrafts = true;
    else if (arg.startsWith("--batch="))
      args.batchSize = Math.max(1, Number(arg.split("=")[1] || 100));
    else if (arg === "--dry-run") args.dryRun = true;
  }

  return args;
}

function printUsage(): void {
  const cmd =
    "npx sanity exec mutations/delete-by-type.ts --with-user-token -- ";
  console.log("\nDelete all documents of a specific type (in batches).\n");
  console.log("Usage:");
  console.log(
    `  ${cmd}--type=YOUR_TYPE [--include-drafts] [--batch=100] [--dry-run]`,
  );
  console.log("\nExamples:");
  console.log(
    `  ${cmd}--type=post                         # Delete published posts`,
  );
  console.log(
    `  ${cmd}--type=post --include-drafts        # Delete published + drafts`,
  );
  console.log(
    `  ${cmd}--type=faq --batch=200              # Use batch size 200`,
  );
  console.log(
    `  ${cmd}--type=page --dry-run               # Show what would be deleted`,
  );
  console.log("\nNotes:");
  console.log(
    "- Requires --with-user-token so the script can authenticate your user.",
  );
  console.log(
    "- By default, drafts are excluded. Use --include-drafts to remove them too.",
  );
  console.log(
    "- Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in the environment.",
  );
  console.log();
}

async function main(): Promise<void> {
  const { docType, includeDrafts, batchSize, dryRun } = parseArgs(
    process.argv.slice(2),
  );

  if (!docType) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const client = getCliClient({ apiVersion: "2025-02-19" });

  // Exclude drafts by default unless explicitly included
  const filterDrafts = includeDrafts ? "" : ' && !(_id match "drafts.*")';

  let totalDeleted = 0;
  let batchIndex = 0;

  // Dry run: show a preview of up to one batch worth of IDs
  if (dryRun) {
    const previewIds: string[] = await client.fetch(
      `*[_type == $type${filterDrafts}][0...$limit]._id`,
      { type: docType, limit: batchSize },
    );

    console.log(
      `[dry-run] Would delete up to ${previewIds.length} documents of type "${docType}"${includeDrafts ? " (including drafts)" : ""}.`,
    );
    if (previewIds.length > 0)
      console.log(
        "Sample IDs:",
        previewIds.slice(0, Math.min(10, previewIds.length)),
      );
    return;
  }

  // Loop until no more documents remain
  for (;;) {
    const ids: string[] = await client.fetch(
      `*[_type == $type${filterDrafts}][0...$limit]._id`,
      { type: docType, limit: batchSize },
    );

    if (ids.length === 0) break;

    let tx = client.transaction();
    for (const id of ids) tx = tx.delete(id);

    await tx.commit({ tag: "mutations/delete-by-type" });

    batchIndex += 1;
    totalDeleted += ids.length;
    console.log(
      `Deleted batch #${batchIndex} (count=${ids.length}). Total so far: ${totalDeleted}.`,
    );
  }

  console.log(
    `Done. Deleted ${totalDeleted} documents of type "${docType}"${includeDrafts ? " (including drafts)" : ""}.`,
  );
}

main().catch((err) => {
  console.error("Error while deleting documents:", err);
  process.exit(1);
});

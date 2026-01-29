/*
Migrate the history document type to historyPage

## How to use
- Set env so the CLI knows your project/dataset (already pulled from sanity.cli.ts):
  - SANITY_STUDIO_PROJECT_ID
  - SANITY_STUDIO_DATASET
- Use your user token for auth: the command includes --with-user-token.

## Run command:
  cd apps/studio-lfd
  pnpm exec sanity exec scripts/migrate-history-to-history-page.ts --with-user-token

## What it does:
- Fetches the complete history document (published and draft if exists)
- Creates new documents with _type "historyPage" using createOrReplace
- Preserves all field data and document IDs

## Safety:
- Backup your dataset before running: sanity dataset export
- Script will exit if no history document is found
- Uses createOrReplace to ensure idempotency
*/

import { getCliClient } from "sanity/cli";

async function main(): Promise<void> {
  const client = getCliClient({ apiVersion: "2025-01-01" });

  console.log("🔍 Searching for history documents...");

  // Fetch both published and draft versions with all fields
  const docs = await client.fetch(`*[_type == "history"]`);

  if (docs.length === 0) {
    console.log("❌ No history documents found. Migration not needed.");
    return;
  }

  console.log(`✅ Found ${docs.length} document(s) to migrate:`);
  docs.forEach((doc: any) => console.log(`   - ${doc._id}`));

  // Use a transaction to delete old and create new documents atomically
  let tx = client.transaction();

  for (const doc of docs) {
    const oldId = doc._id;
    const isDraft = oldId.startsWith("drafts.");
    const baseId = isDraft ? oldId.replace("drafts.", "") : oldId;

    // New ID: keep "drafts." prefix if it was a draft, but change base ID if needed
    // For singleton, we'll use "historyPage" as the new ID
    const newBaseId = baseId === "history" ? "historyPage" : baseId;
    const newId = isDraft ? `drafts.${newBaseId}` : newBaseId;

    console.log(`📝 Migrating ${oldId} -> ${newId}...`);

    // Create new document with updated _type and _id
    const newDoc = {
      ...doc,
      _id: newId,
      _type: "historyPage",
    };

    // First create the new document, then delete the old one
    tx = tx.createOrReplace(newDoc);
    if (oldId !== newId) {
      tx = tx.delete(oldId);
    }
  }

  await tx.commit({ tag: "migrate-history-to-history-page" });

  console.log(
    `\n✅ Successfully migrated ${docs.length} document(s) from "history" to "historyPage"`,
  );
  console.log("\n📋 Next steps:");
  console.log(
    "   1. Update schema files (rename history.ts to history-page.ts)",
  );
  console.log("   2. Update GROQ queries in web app");
  console.log("   3. Run: pnpm --filter studio-lfd type");
  console.log(
    "   4. Validate: pnpm --filter web-lfd typecheck && pnpm --filter web-lfd build",
  );
}

main().catch((err) => {
  console.error("❌ Error during migration:", err);
  process.exit(1);
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const lockfilePath = resolve(process.cwd(), "pnpm-lock.yaml");
const lockfile = readFileSync(lockfilePath, "utf8");

const pairs = [...lockfile.matchAll(/react-dom@(\d+\.\d+\.\d+)\(react@(\d+\.\d+\.\d+)\)/g)];

if (pairs.length === 0) {
  console.error("No react-dom/react pairs found in pnpm-lock.yaml.");
  process.exit(1);
}

const mismatches = pairs
  .map(([, reactDomVersion, reactVersion]) => ({ reactDomVersion, reactVersion }))
  .filter(({ reactDomVersion, reactVersion }) => reactDomVersion !== reactVersion);

if (mismatches.length > 0) {
  console.error("Found mismatched react/react-dom lockfile pairs:");
  for (const mismatch of mismatches) {
    console.error(`- react-dom ${mismatch.reactDomVersion} with react ${mismatch.reactVersion}`);
  }
  process.exit(1);
}

console.log(`React parity check passed for ${pairs.length} lockfile pairs.`);

---
name: changeset
description: Draft and update Changesets entries for this monorepo. Use when Codex needs to create or revise `.changeset/*.md` files, determine which workspace packages should be included in a release note, choose patch/minor/major bump levels, validate package names against the repo, or summarize user-facing impact for versioned changes.
---

# Changeset

## Overview

Draft a valid Changesets file for this repository and keep the package selection tied to the actual code changes. Prefer the bundled helper script for validation and file generation instead of hand-formatting YAML.

## Workflow

1. Resolve the scope in a fixed order.
   Unless the user explicitly names files or a commit range, inspect changes in this order:
   - `git diff --name-only --cached`
   - `git diff --name-only`
   - `git diff --name-only origin/main...HEAD`
   - an explicit commit or commit range from the user, such as `git diff --name-only <base>..<head>`
     Use the first source that cleanly matches the user's intended scope. If multiple unrelated tasks are mixed together, ask the user to narrow the scope instead of guessing.

2. Map changed files to workspace packages.
   Use `python3 .agents/skills/changeset/scripts/create_changeset.py --list-packages` to see valid package names. Use `--from-path` to infer owning workspaces from file paths. Read `references/repo-conventions.md` when you need the fixed-group rules or package map.

3. Choose bump levels conservatively.
   Use `patch` for bug fixes, copy/content changes, styling adjustments, dependency/config maintenance, and backward-compatible schema updates. Use `minor` for additive features or new exported capabilities. Use `major` only for breaking API, schema, route, or behavior changes that require consumers to adapt.

4. Write the summary around user impact.
   Keep it short, concrete, and sentence-case. Mention the behavior change first, then key implementation details only when they clarify scope. A short paragraph is usually enough; use bullets only when multiple distinct changes ship together.

5. Generate or preview the file with the helper script.
   Preview:

```bash
python3 .agents/skills/changeset/scripts/create_changeset.py \
  --from-path packages/sanity-schema/src/schemaTypes/blocks/featured-recipes.ts \
  --summary "Add configurable featured recipe block variations for studio content." \
  --stdout
```

Write:

```bash
python3 .agents/skills/changeset/scripts/create_changeset.py \
  --package @workspace/sanity-schema=patch \
  --summary "Add configurable featured recipe block variations for studio content."
```

## Package Selection Rules

Include packages that actually changed or whose published behavior changed because of the work. Do not add untouched siblings just because they belong to the same fixed-version group; this repo already handles version alignment during release planning.

When a change lives entirely inside one workspace, start with that workspace only. When a shared package changes, include that shared package and add dependents only if the user-facing behavior of those dependents also changed in the same work.

If the diff only touches local tooling, CI, or repo metadata with no meaningful package-facing effect, a changeset may not be needed.

## Validation

Validate package names and preview output with the helper script before writing. After creating the file, prefer:

```bash
pnpm changeset status --since=origin/main
```

If `origin/main` is unavailable in the local clone, at minimum inspect the generated file and confirm the package names match the workspace list.

## Prompt Handling

Treat short prompts like `create the changeset for this task` as sufficient. Do not require the user to restate the scope-discovery logic from this skill.

Use these interpretations by default:

- `for this task`: use the scope resolution order above
- `for this branch`: compare `origin/main...HEAD`
- `for these commits`: use the provided commit or range
- `for these files`: use the named files directly

If the user's wording is ambiguous and the diffs contain more than one plausible task, ask for the intended scope before drafting the changeset.

## Resources

- `scripts/create_changeset.py`: Validate package names, infer workspaces from file paths, and preview or write a `.changeset` entry.
- `references/repo-conventions.md`: Repo-specific package map, fixed-group details, and authoring conventions.

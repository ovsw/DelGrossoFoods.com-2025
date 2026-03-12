# Repo Conventions

## Table of Contents

- Workspace map
- Changesets config
- Authoring guidance
- Examples

## Workspace Map

The helper script discovers packages from `apps/*/package.json` and `packages/*/package.json`.

Current workspaces:

- `web-dgf`: `apps/web-dgf`
- `web-lfd`: `apps/web-lfd`
- `studio-dgf`: `apps/studio-dgf`
- `studio-lfd`: `apps/studio-lfd`
- `@workspace/eslint-config`: `packages/eslint-config`
- `@workspace/typescript-config`: `packages/typescript-config`
- `@workspace/ui`: `packages/ui`
- `@workspace/sanity-config`: `packages/sanity-config`
- `@workspace/sanity-schema`: `packages/sanity-schema`

## Changesets Config

The repo-level configuration lives at `.changeset/config.json`.

Observed conventions:

- `baseBranch` is `main`.
- GitHub changelog entries point at `ovsw/DelGrossoFoods.com-2025`.
- `commit` is `false`, so adding a changeset does not auto-create a commit.
- `updateInternalDependencies` is `patch`.
- `access` is `restricted`.

Current fixed-version group:

- `web-dgf`
- `web-lfd`
- `studio-dgf`
- `studio-lfd`
- `@workspace/eslint-config`
- `@workspace/typescript-config`
- `@workspace/ui`

Packages currently outside that fixed group:

- `@workspace/sanity-config`
- `@workspace/sanity-schema`

## Authoring Guidance

Use the smallest set of packages that accurately describes the shipped change.

Practical rules:

- If code changes only under one app or one package, start with that workspace only.
- If a shared package changes, include that package. Add consuming apps only when their user-facing behavior also changes in the same work.
- Do not include every member of the fixed-version group just because one of them changed. Existing repo history shows selective package entries are normal.
- Prefer `patch` unless the change clearly adds new capability (`minor`) or breaks consumers (`major`).

Summary style:

- Lead with the behavior change.
- Keep implementation detail secondary.
- Use one short paragraph for most changesets.
- Use bullets only when the release note genuinely contains separate deliverables.

## Examples

Single shared package patch:

```md
---
"@workspace/sanity-schema": patch
---

Add configurable featured recipe block variations for studio content.
```

Two app patch:

```md
---
"web-dgf": patch
"web-lfd": patch
---

Update FoxyCart data to use the live stores.
```

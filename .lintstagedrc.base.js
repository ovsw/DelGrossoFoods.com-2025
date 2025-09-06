/**
 * Shared lint-staged base config for cross-cutting formatting tasks.
 * Keep package-specific rules (ESLint, etc.) in each package's .lintstagedrc.js
 */

export default {
  '*.{md,mdx,json,yml,yaml}': ['pnpm -w dlx prettier --write --ignore-unknown'],
};

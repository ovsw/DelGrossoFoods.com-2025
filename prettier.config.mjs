/**
 * Centralized Prettier config for the monorepo
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 80,
  semi: true,
  bracketSpacing: true,
  singleQuote: false,
  overrides: [
    // Add package-specific overrides here only if truly needed.
  ],
};

export default config;

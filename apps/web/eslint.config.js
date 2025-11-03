import { nextJsConfig } from "@workspace/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    settings: {
      turbo: {
        rootDir: ["../../"],
      },
    },
  },
  {
    ignores: ["**/next-env.d.ts", "**/.next/**"],
  },
  {
    files: ["src/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components/pagebuilder/**",
                "**/components/pagebuilder/**",
              ],
              message:
                "Pagebuilder blocks are CMS-managed. Render them via PageBuilder instead of importing directly.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/components/pagebuilder/**", "src/components/pagebuilder.tsx"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];

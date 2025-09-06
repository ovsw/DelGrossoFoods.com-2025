import baseConfig from "../../.lintstagedrc.base.mjs";

export default {
  ...baseConfig,
  "*.{js,jsx,ts,tsx}": [
    "pnpm -w dlx eslint --cache --cache-location node_modules/.cache/eslint/.eslintcache --max-warnings 0 --fix",
  ],
};

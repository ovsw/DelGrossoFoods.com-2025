import baseConfig from "../../.lintstagedrc.base.mjs";

export default {
  ...baseConfig,
  "*.{js,jsx,ts,tsx}": ["pnpm -w dlx eslint --cache --max-warnings 0 --fix"],
};

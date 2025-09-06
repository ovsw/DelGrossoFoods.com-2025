export default {
  ...baseConfig,
  "*.{js,jsx,ts,tsx}": [
    "pnpm -w dlx eslint --cache --cache-location node_modules/.cache/eslint/.eslintcache --fix",
  ],
};

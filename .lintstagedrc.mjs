import base from "./.lintstagedrc.base.mjs";

export default {
  ...base,
  "*.{js,cjs,mjs,jsx,ts,tsx,css,scss}": [
    "pnpm -w dlx prettier --write --ignore-unknown",
  ],
};

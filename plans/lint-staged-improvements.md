### Lint-staged improvements checklist

- [ ] Create shared base config `/.lintstagedrc.base.js` with cross-cutting Prettier tasks
- [ ] Add per-package `.lintstagedrc.js` in `apps/web`, `apps/studio`, `packages/ui` extending the base and defining ESLint tasks
- [ ] Remove root `lint-staged` block from `package.json` to avoid conflicts
- [ ] Add Husky `pre-push` hook to run repo type checks (fast, non-blocking during commit)
- [ ] Ensure each package has a `typecheck` script (or uses `turbo check-types`) used by pre-push
- [ ] Verify lint-staged discovery works per package (closest config wins)
- [ ] Run `pnpm -w dlx prettier --write` to format new configs
- [ ] Run `pnpm --filter ./apps/web lint:fix` and same for other packages to ensure no lints introduced

Notes

- Keep Prettier rules in the base to avoid duplication. Use `--ignore-unknown` so non-code files are safe.
- ESLint should run once with `--fix`, `--cache`, and `--max-warnings 0` per package.
- Pre-commit stays fast; heavy checks (typecheck) move to pre-push.

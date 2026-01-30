
#!/usr/bin/env bash
set -euo pipefail

# Gather context from Vercel (with local fallbacks for testing)
msg="${VERCEL_GIT_COMMIT_MESSAGE:-$(git log -1 --pretty=%B 2>/dev/null || echo '')}"
ref="${VERCEL_GIT_COMMIT_REF:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')}"
author_login="${VERCEL_GIT_COMMIT_AUTHOR_LOGIN:-}"
author_name="${VERCEL_GIT_COMMIT_AUTHOR_NAME:-}"
author="${author_login:-$author_name}"

if [[ "$ref" == "feat/multisite-dgf-lfd" ]]; then
  echo "🛑 Skipping build: branch feat/multisite-dgf-lfd deploys via dedicated project."
  exit 0
fi

is_changesets_bump() {
  # 1) PRs from changesets use branches like `changeset-release/main`
  if [[ "$ref" =~ ^changeset-release(/|$) ]]; then
    return 0
  fi

  # 2) Typical title for the versioning PR / merge commit
  #    Examples: "Version Packages", "Version Packages (#29)"
  if echo "$msg" | grep -qiE '(^|\s)version packages(\b|[(:#])'; then
    return 0
  fi

  # 3) Merge commits may contain the source branch name
  if echo "$msg" | grep -qi 'changeset-release'; then
    return 0
  fi

  # 4) Bot-authored messages that also look like a release/version bump
  if { [[ "$author" == "changeset-bot" ]] || [[ "$author" == "changesets[bot]" ]] || [[ "$author" == "github-actions[bot]" ]]; } \
     && echo "$msg" | grep -qiE 'version packages|release'; then
    return 0
  fi

  return 1
}

if is_changesets_bump; then
  echo "🛑 Skipping build: Changesets version bump (env=$VERCEL_ENV, ref=$ref)."
  # Per Vercel docs: exit 0 cancels the build; exit 1 continues
  exit 0
fi

echo "✅ Build can proceed."
exit 1

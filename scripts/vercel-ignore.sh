#!/usr/bin/env bash

set -euo pipefail

echo "VERCEL_ENV=$VERCEL_ENV"
echo "VERCEL_GIT_COMMIT_REF=${VERCEL_GIT_COMMIT_REF:-}"

[ "${VERCEL_ENV:-}" = "preview" ] || exit 1

case "${VERCEL_GIT_COMMIT_REF:-}" in
  changeset-release/*)
    echo "Skipping preview for Changesets release branch: $VERCEL_GIT_COMMIT_REF"
    exit 0
    ;;
  *)
    exit 1
    ;;
esac

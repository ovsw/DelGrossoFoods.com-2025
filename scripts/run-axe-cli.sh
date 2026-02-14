#!/usr/bin/env bash

set -euo pipefail

if [ "${1-}" = "--" ]; then
  shift
fi

if [ "$#" -lt 1 ]; then
  echo "Usage: pnpm a11y:axe -- <url> [more-axe-options]"
  exit 1
fi

echo "Installing matched Chrome + Chromedriver..."
pnpm dlx browser-driver-manager install chrome >/dev/null 2>&1
which_output="$(pnpm dlx browser-driver-manager which 2>&1)"

chrome_path="$(printf '%s\n' "$which_output" | sed -n 's/^CHROME_TEST_PATH=\"\(.*\)\"$/\1/p' | head -n 1)"
chromedriver_path="$(printf '%s\n' "$which_output" | sed -n 's/^CHROMEDRIVER_TEST_PATH=\"\(.*\)\"$/\1/p' | head -n 1)"

if [ -z "$chrome_path" ] || [ -z "$chromedriver_path" ]; then
  echo "Failed to resolve CHROME_TEST_PATH or CHROMEDRIVER_TEST_PATH from browser-driver-manager output."
  exit 1
fi

echo "Using Chrome: $chrome_path"
echo "Using Chromedriver: $chromedriver_path"
echo "Running Axe CLI..."

pnpm dlx @axe-core/cli "$@" --chrome-path "$chrome_path" --chromedriver-path "$chromedriver_path"

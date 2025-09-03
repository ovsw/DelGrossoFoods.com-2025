#!/bin/bash

# Get the latest commit message
COMMIT_MSG=$(git log -1 --pretty=%B)

# Check if the commit message is from changesets
if [[ "$COMMIT_MSG" == "Version Packages" ]]; then
  # If it is, exit with 0 to skip the build
  echo "🛑 Build skipped: Commit is a version bump from changesets."
  exit 0
else
  # For all other commits, exit with 1 to proceed with the build
  echo "✅ Build can proceed."
  exit 1
fi
export function buildLfdSauceDisplayName(
  name: string,
  authorName: string | null | undefined,
) {
  const trimmedName = name.trim();
  const trimmedAuthorName = authorName?.trim();

  if (!trimmedAuthorName) {
    return trimmedName;
  }

  const suffix = trimmedAuthorName.endsWith("s") ? "'" : "'s";
  return `${trimmedAuthorName}${suffix} ${trimmedName}`;
}

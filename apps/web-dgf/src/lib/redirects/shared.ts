export interface RedirectSpec {
  readonly source: string;
  readonly destination: string;
}

export interface NextRedirect {
  readonly source: string;
  readonly destination: string;
  readonly permanent: true;
}

function toPathVariants(source: string): readonly string[] {
  if (source === "/") return [source] as const;

  const withTrailingSlash = source.endsWith("/") ? source : `${source}/`;
  const withoutTrailingSlash =
    withTrailingSlash === "/"
      ? withTrailingSlash
      : withTrailingSlash.slice(0, -1);

  return withTrailingSlash === withoutTrailingSlash
    ? [withTrailingSlash]
    : [withTrailingSlash, withoutTrailingSlash];
}

export function expandRedirectSpecs(
  redirectSpec: readonly RedirectSpec[],
): NextRedirect[] {
  return redirectSpec.flatMap(({ source, destination }) =>
    toPathVariants(source).map((variant) => ({
      source: variant,
      destination,
      permanent: true as const,
    })),
  );
}

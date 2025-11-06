const FOXY_DOMAIN_SUFFIX = ".foxycart.com" as const;

function extractHostname(rawValue: string | undefined): string | null {
  if (!rawValue) return null;
  const trimmed = rawValue.trim();
  if (!trimmed) return null;

  const attemptParse = (value: string) => {
    try {
      const url = new URL(value);
      return url.hostname ?? null;
    } catch {
      return null;
    }
  };

  const direct = attemptParse(trimmed);
  if (direct) return direct.toLowerCase();

  const withProtocol = attemptParse(`https://${trimmed}`);
  if (withProtocol) return withProtocol.toLowerCase();

  // Fallback: remove protocol-like prefixes and trailing paths manually
  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
  const segments = withoutProtocol
    .split("/")
    .filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    return null;
  }

  const sanitized = segments[0]!.trim().toLowerCase();
  return sanitized.length > 0 ? sanitized : null;
}

export interface FoxyConfig {
  readonly cartDomain: string;
  readonly loaderSlug: string;
}

export function resolveFoxyConfig(
  rawDomain: string | undefined,
): FoxyConfig | null {
  const hostname = extractHostname(rawDomain);
  if (!hostname) return null;

  const loaderSlug = hostname.endsWith(FOXY_DOMAIN_SUFFIX)
    ? hostname.slice(0, -FOXY_DOMAIN_SUFFIX.length)
    : hostname;

  if (!loaderSlug || !/^[a-z0-9-]+$/.test(loaderSlug)) {
    return null;
  }

  const base = hostname.replace(/\.+$/, "");
  const cartDomain = base.includes(".") ? base : `${base}${FOXY_DOMAIN_SUFFIX}`;

  return {
    cartDomain,
    loaderSlug,
  };
}

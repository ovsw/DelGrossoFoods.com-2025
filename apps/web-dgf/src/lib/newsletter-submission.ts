const CONSTANT_CONTACT_TOKEN_URL =
  "https://authz.constantcontact.com/oauth2/default/v1/token";
const CONSTANT_CONTACT_SIGNUP_URL =
  "https://api.cc.email/v3/contacts/sign_up_form";
const CONSTANT_CONTACT_REQUEST_DEADLINE_MS = 10_000;
const CONSTANT_CONTACT_TOKEN_EXPIRY_BUFFER_MS = 60_000;

function encodeBasicAuthCredentials(
  clientId: string,
  clientSecret: string,
): string {
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}

async function runConstantContactWithDeadline<T>(
  operation: (signal: AbortSignal) => Promise<T>,
  errorMessage: string,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    CONSTANT_CONTACT_REQUEST_DEADLINE_MS,
  );

  try {
    return await operation(controller.signal);
  } catch (error) {
    if (error instanceof Error && error.message === errorMessage) {
      throw error;
    }
    throw new Error(errorMessage);
  } finally {
    clearTimeout(timeoutId);
  }
}

export type NewsletterSubmissionPayload = {
  email: string;
};

export type NewsletterSubmissionSuccess = {
  ok: true;
};

export type NewsletterSubmissionFailure = {
  ok: false;
  message: string;
};

export type NewsletterSubmissionResponse =
  | NewsletterSubmissionSuccess
  | NewsletterSubmissionFailure;

export const NEWSLETTER_SUBMISSION_VALIDATION_MESSAGES = new Set([
  "Email is required",
  "Please enter a valid email address including a domain",
]);

type ConstantContactTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number | string;
  refresh_token?: string;
};

export type ConstantContactTokenRequest = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

type ConstantContactTokenCache = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

const constantContactTokenCache = new Map<string, ConstantContactTokenCache>();
const constantContactTokenRefreshPromises = new Map<string, Promise<string>>();

function getCachedConstantContactAccessToken(
  cacheKey: string,
  now = Date.now(),
): string | null {
  const cache = constantContactTokenCache.get(cacheKey);

  if (!cache || cache.expiresAt <= now) {
    return null;
  }

  return cache.accessToken;
}

function getPositiveExpiresInSeconds(
  value: ConstantContactTokenResponse["expires_in"],
): number | null {
  const expiresInSeconds =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
    ? expiresInSeconds
    : null;
}

function getConstantContactTokenExpiresAt(expiresInSeconds: number): number {
  return (
    Date.now() +
    Math.max(
      expiresInSeconds * 1000 - CONSTANT_CONTACT_TOKEN_EXPIRY_BUFFER_MS,
      0,
    )
  );
}

function cleanOptional(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function requireNonEmptyString(value: unknown, fieldName: string): string {
  const cleaned = cleanOptional(value);
  if (!cleaned) {
    throw new Error(`${fieldName} is required`);
  }
  return cleaned;
}

export function normalizeNewsletterPayload(
  input: unknown,
): NewsletterSubmissionPayload {
  if (!input || typeof input !== "object") {
    throw new Error("Email is required");
  }

  const data = input as Record<string, unknown>;
  const email = requireNonEmptyString(data.email, "Email");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
    throw new Error("Please enter a valid email address including a domain");
  }

  return {
    email: email.toLowerCase(),
  };
}

async function refreshConstantContactAccessToken(
  { clientId, clientSecret, refreshToken }: ConstantContactTokenRequest,
  cacheKey: string,
): Promise<string> {
  const credentials = encodeBasicAuthCredentials(clientId, clientSecret);
  const currentRefreshToken =
    constantContactTokenCache.get(cacheKey)?.refreshToken ?? refreshToken;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: currentRefreshToken,
  });

  const { response, token } = await runConstantContactWithDeadline(
    async (signal) => {
      const response = await fetch(CONSTANT_CONTACT_TOKEN_URL, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body,
        cache: "no-store",
        signal,
      });

      const token: ConstantContactTokenResponse = response.ok
        ? ((await response.json()) as ConstantContactTokenResponse)
        : {};

      return { response, token };
    },
    "Newsletter service is unavailable.",
  );

  const expiresInSeconds = getPositiveExpiresInSeconds(token.expires_in);

  if (!response.ok || !token.access_token || !expiresInSeconds) {
    console.error("Constant Contact token refresh failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Newsletter service is unavailable.");
  }

  const cache = {
    accessToken: token.access_token,
    refreshToken: cleanOptional(token.refresh_token) || currentRefreshToken,
    expiresAt: getConstantContactTokenExpiresAt(expiresInSeconds),
  };

  constantContactTokenCache.set(cacheKey, cache);

  return cache.accessToken;
}

export async function getConstantContactAccessToken(
  request: ConstantContactTokenRequest,
): Promise<string> {
  const cacheKey = request.clientId;
  const cachedAccessToken = getCachedConstantContactAccessToken(cacheKey);
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const existingRefreshPromise =
    constantContactTokenRefreshPromises.get(cacheKey);
  if (existingRefreshPromise) {
    return existingRefreshPromise;
  }

  const refreshPromise = refreshConstantContactAccessToken(
    request,
    cacheKey,
  ).finally(() => {
    constantContactTokenRefreshPromises.delete(cacheKey);
  });

  constantContactTokenRefreshPromises.set(cacheKey, refreshPromise);

  return refreshPromise;
}

export async function submitNewsletterSignup({
  accessToken,
  email,
  listId,
}: {
  accessToken: string;
  email: string;
  listId: string;
}): Promise<void> {
  const response = await runConstantContactWithDeadline(
    (signal) =>
      fetch(CONSTANT_CONTACT_SIGNUP_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          list_memberships: [listId],
        }),
        cache: "no-store",
        signal,
      }),
    "Sorry, there was an error subscribing. Please try again.",
  );

  if (!response.ok) {
    console.error("Constant Contact newsletter signup failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error("Sorry, there was an error subscribing. Please try again.");
  }
}

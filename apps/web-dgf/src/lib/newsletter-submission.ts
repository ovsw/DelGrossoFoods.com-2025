import { randomUUID } from "node:crypto";

import { Redis } from "@upstash/redis";

const CONSTANT_CONTACT_TOKEN_URL =
  "https://authz.constantcontact.com/oauth2/default/v1/token";
const CONSTANT_CONTACT_SIGNUP_URL =
  "https://api.cc.email/v3/contacts/sign_up_form";
const CONSTANT_CONTACT_REQUEST_DEADLINE_MS = 10_000;
const CONSTANT_CONTACT_TOKEN_EXPIRY_BUFFER_MS = 60_000;
const CONSTANT_CONTACT_REFRESH_LOCK_SECONDS = 30;
const CONSTANT_CONTACT_REFRESH_LOCK_RETRY_MS = 250;
const CONSTANT_CONTACT_REFRESH_LOCK_ATTEMPTS = 40;
const CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE =
  "Newsletter service is unavailable.";
const RELEASE_CONSTANT_CONTACT_REFRESH_LOCK_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
end
return 0
`;

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
  tokenStoreKey: string;
};

type ConstantContactTokenCache = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

const constantContactTokenCache = new Map<string, ConstantContactTokenCache>();
const constantContactTokenRefreshPromises = new Map<string, Promise<string>>();
let constantContactRedis: Redis | null = null;

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

function getValidConstantContactAccessToken(
  cacheKey: string,
  cache: ConstantContactTokenCache | null,
  now = Date.now(),
): string | null {
  if (!cache || cache.expiresAt <= now) {
    return null;
  }

  constantContactTokenCache.set(cacheKey, cache);
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

function getConstantContactRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE);
  }

  constantContactRedis ??= new Redis({
    url,
    token,
  });

  return constantContactRedis;
}

function parseConstantContactTokenCache(
  input: unknown,
): ConstantContactTokenCache | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const data = input as Record<string, unknown>;
  const accessToken = cleanOptional(data.accessToken);
  const refreshToken = cleanOptional(data.refreshToken);
  const expiresAt =
    typeof data.expiresAt === "number"
      ? data.expiresAt
      : typeof data.expiresAt === "string"
        ? Number(data.expiresAt)
        : Number.NaN;

  if (!accessToken || !refreshToken || !Number.isFinite(expiresAt)) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
}

async function getStoredConstantContactToken(
  redis: Redis,
  cacheKey: string,
): Promise<ConstantContactTokenCache | null> {
  try {
    const stored = await redis.get<unknown>(cacheKey);
    const token = parseConstantContactTokenCache(stored);

    if (stored !== null && !token) {
      console.error("Constant Contact token store contains invalid data", {
        tokenStoreKey: cacheKey,
      });
    }

    if (token) {
      constantContactTokenCache.set(cacheKey, token);
    }

    return token;
  } catch (error) {
    console.error("Constant Contact token store read failed", {
      tokenStoreKey: cacheKey,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE);
  }
}

async function setStoredConstantContactToken(
  redis: Redis,
  cacheKey: string,
  token: ConstantContactTokenCache,
): Promise<void> {
  try {
    await redis.set(cacheKey, token);
  } catch (error) {
    console.error("Constant Contact token store write failed", {
      tokenStoreKey: cacheKey,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE);
  }
}

async function acquireConstantContactRefreshLock(
  redis: Redis,
  lockKey: string,
  lockValue: string,
): Promise<boolean> {
  try {
    const result = await redis.set(lockKey, lockValue, {
      nx: true,
      ex: CONSTANT_CONTACT_REFRESH_LOCK_SECONDS,
    });

    return result === "OK";
  } catch (error) {
    console.error("Constant Contact token refresh lock failed", {
      tokenStoreKey: lockKey,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new Error(CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE);
  }
}

async function releaseConstantContactRefreshLock(
  redis: Redis,
  lockKey: string,
  lockValue: string,
): Promise<void> {
  try {
    await redis.eval(
      RELEASE_CONSTANT_CONTACT_REFRESH_LOCK_SCRIPT,
      [lockKey],
      [lockValue],
    );
  } catch (error) {
    console.error("Constant Contact token refresh lock release failed", {
      tokenStoreKey: lockKey,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
  { clientId, clientSecret }: ConstantContactTokenRequest,
  currentRefreshToken: string,
): Promise<ConstantContactTokenCache> {
  const credentials = encodeBasicAuthCredentials(clientId, clientSecret);
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
    CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE,
  );

  const expiresInSeconds = getPositiveExpiresInSeconds(token.expires_in);

  if (!response.ok || !token.access_token || !expiresInSeconds) {
    console.error("Constant Contact token refresh failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE);
  }

  return {
    accessToken: token.access_token,
    refreshToken: cleanOptional(token.refresh_token) || currentRefreshToken,
    expiresAt: getConstantContactTokenExpiresAt(expiresInSeconds),
  };
}

async function getConstantContactAccessTokenWithLock({
  redis,
  request,
  cacheKey,
}: {
  redis: Redis;
  request: ConstantContactTokenRequest;
  cacheKey: string;
}): Promise<string> {
  const lockKey = `${cacheKey}:refresh-lock`;
  const lockValue = randomUUID();

  for (
    let attempt = 0;
    attempt < CONSTANT_CONTACT_REFRESH_LOCK_ATTEMPTS;
    attempt += 1
  ) {
    const lockAcquired = await acquireConstantContactRefreshLock(
      redis,
      lockKey,
      lockValue,
    );

    if (lockAcquired) {
      try {
        const storedToken = await getStoredConstantContactToken(
          redis,
          cacheKey,
        );
        const storedAccessToken = getValidConstantContactAccessToken(
          cacheKey,
          storedToken,
        );

        if (storedAccessToken) {
          return storedAccessToken;
        }

        const refreshedToken = await refreshConstantContactAccessToken(
          request,
          storedToken?.refreshToken ?? request.refreshToken,
        );

        await setStoredConstantContactToken(redis, cacheKey, refreshedToken);
        constantContactTokenCache.set(cacheKey, refreshedToken);

        return refreshedToken.accessToken;
      } finally {
        await releaseConstantContactRefreshLock(redis, lockKey, lockValue);
      }
    }

    await wait(CONSTANT_CONTACT_REFRESH_LOCK_RETRY_MS);

    const storedToken = await getStoredConstantContactToken(redis, cacheKey);
    const storedAccessToken = getValidConstantContactAccessToken(
      cacheKey,
      storedToken,
    );

    if (storedAccessToken) {
      return storedAccessToken;
    }
  }

  console.error("Constant Contact token refresh lock timed out", {
    tokenStoreKey: cacheKey,
  });
  throw new Error(CONSTANT_CONTACT_SERVICE_UNAVAILABLE_MESSAGE);
}

export async function getConstantContactAccessToken(
  request: ConstantContactTokenRequest,
): Promise<string> {
  const cacheKey = request.tokenStoreKey;
  const cachedAccessToken = getCachedConstantContactAccessToken(cacheKey);
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const redis = getConstantContactRedis();
  const storedToken = await getStoredConstantContactToken(redis, cacheKey);
  const storedAccessToken = getValidConstantContactAccessToken(
    cacheKey,
    storedToken,
  );

  if (storedAccessToken) {
    return storedAccessToken;
  }

  const existingRefreshPromise =
    constantContactTokenRefreshPromises.get(cacheKey);
  if (existingRefreshPromise) {
    return existingRefreshPromise;
  }

  const refreshPromise = getConstantContactAccessTokenWithLock({
    redis,
    request,
    cacheKey,
  }).finally(() => {
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

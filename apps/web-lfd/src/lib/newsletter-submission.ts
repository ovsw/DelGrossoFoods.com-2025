const CONSTANT_CONTACT_TOKEN_URL =
  "https://authz.constantcontact.com/oauth2/default/v1/token";
const CONSTANT_CONTACT_SIGNUP_URL =
  "https://api.cc.email/v3/contacts/sign_up_form";

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
  expires_in?: number;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

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

export async function getConstantContactAccessToken({
  clientId,
  clientSecret,
  refreshToken,
}: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<string> {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(CONSTANT_CONTACT_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  const token = (await response.json()) as ConstantContactTokenResponse;

  if (!response.ok || !token.access_token) {
    console.error("Constant Contact token refresh failed", {
      status: response.status,
      error: token.error,
      errorDescription: token.error_description,
    });
    throw new Error("Newsletter service is unavailable.");
  }

  return token.access_token;
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
  const response = await fetch(CONSTANT_CONTACT_SIGNUP_URL, {
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
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Constant Contact newsletter signup failed", {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
    });
    throw new Error("Sorry, there was an error subscribing. Please try again.");
  }
}

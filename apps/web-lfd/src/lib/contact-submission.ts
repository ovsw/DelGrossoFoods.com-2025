import { randomBytes } from "node:crypto";

const REFERENCE_ID_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ";
const RANDOM_SUFFIX_LENGTH = 4;
const EASTERN_TIMEZONE = "America/New_York";

export type ContactFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  brand: "la-famiglia" | "delgrosso-foods" | "organic" | "";
  message: string;
};

export type ContactSubmissionResponse =
  | { ok: true; referenceId: string }
  | { ok: false; message: string };

export const CONTACT_SUBMISSION_VALIDATION_MESSAGES = new Set([
  "Invalid form submission",
  "First name is required",
  "Last name is required",
  "Email is required",
  "Please enter a valid email address including a domain",
  "Please select a brand",
  "Message is required",
  "Message must be at least 10 characters",
]);

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

function normalizeEmail(value: unknown): string {
  const email = requireNonEmptyString(value, "Email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  if (!emailPattern.test(email)) {
    throw new Error("Please enter a valid email address including a domain");
  }

  return email.toLowerCase();
}

function normalizeBrand(value: unknown): ContactFormPayload["brand"] {
  if (
    value === "la-famiglia" ||
    value === "delgrosso-foods" ||
    value === "organic"
  ) {
    return value;
  }

  throw new Error("Please select a brand");
}

export function normalizeContactFormPayload(
  input: unknown,
): ContactFormPayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid form submission");
  }

  const data = input as Record<string, unknown>;
  const message = requireNonEmptyString(data.message, "Message");

  if (message.length < 10) {
    throw new Error("Message must be at least 10 characters");
  }

  return {
    firstName: requireNonEmptyString(data.firstName, "First name"),
    lastName: requireNonEmptyString(data.lastName, "Last name"),
    email: normalizeEmail(data.email),
    phone: cleanOptional(data.phone),
    brand: normalizeBrand(data.brand),
    message,
  };
}

function getDatePrefix(now: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: EASTERN_TIMEZONE,
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(now);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<"month" | "day" | "year", string>;

  return `${values.month}${values.day}${values.year}`;
}

function getRandomSuffix(): string {
  const bytes = randomBytes(RANDOM_SUFFIX_LENGTH);
  let output = "";

  for (const byte of bytes) {
    output += REFERENCE_ID_LETTERS[byte % REFERENCE_ID_LETTERS.length];
  }

  return output;
}

export function generateReferenceId(now = new Date()): string {
  return `${getDatePrefix(now)}-${getRandomSuffix()}`;
}

export function buildFormsparkPayload(
  payload: ContactFormPayload,
  referenceId: string,
  subjectLabel: string,
) {
  return {
    ...payload,
    referenceId,
    _email: {
      subject: `${subjectLabel} [${referenceId}]`,
    },
  };
}

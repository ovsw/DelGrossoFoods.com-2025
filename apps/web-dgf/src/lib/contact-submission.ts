import { randomBytes } from "node:crypto";

const REFERENCE_ID_LETTERS = "ABCDEFGHJKMNPQRSTUVWXYZ";
const RANDOM_SUFFIX_LENGTH = 4;
const EASTERN_TIMEZONE = "America/New_York";

export type ContactFormPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addressLine1?: string;
  city?: string;
  zip?: string;
  state?: string;
  howDidYouHearAboutUs?: "" | "store" | "word-of-mouth" | "media-ad" | "other";
  nameOfSupermarket?: string;
  otherReferralDetail?: string;
  brand: "la-famiglia" | "delgrosso-foods" | "organic" | "";
  message: string;
};

export type ContactSubmissionSuccess = {
  ok: true;
  referenceId: string;
};

export type ContactSubmissionFailure = {
  ok: false;
  message: string;
};

export type ContactSubmissionResponse =
  | ContactSubmissionSuccess
  | ContactSubmissionFailure;

export const CONTACT_SUBMISSION_VALIDATION_MESSAGES = new Set([
  "Invalid form submission",
  "First name is required",
  "Last name is required",
  "Email is required",
  "Please enter a valid email address including a domain",
  "Please select a brand",
  "Message is required",
  "Message must be at least 10 characters",
  "Name of Supermarket is required",
  "Please tell us how you heard about us",
]);

type CleanContactFormPayload = {
  [K in keyof ContactFormPayload]: string;
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

function normalizeEmail(value: unknown): string {
  const email = requireNonEmptyString(value, "Email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
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

function normalizeReferralSource(
  value: unknown,
): ContactFormPayload["howDidYouHearAboutUs"] {
  if (
    value === "" ||
    value === "store" ||
    value === "word-of-mouth" ||
    value === "media-ad" ||
    value === "other"
  ) {
    return value;
  }
  return "";
}

export function normalizeContactFormPayload(
  input: unknown,
): CleanContactFormPayload {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid form submission");
  }

  const data = input as Record<string, unknown>;
  const referralSource = normalizeReferralSource(data.howDidYouHearAboutUs);
  const cleaned: CleanContactFormPayload = {
    firstName: requireNonEmptyString(data.firstName, "First name"),
    lastName: requireNonEmptyString(data.lastName, "Last name"),
    email: normalizeEmail(data.email),
    phone: cleanOptional(data.phone),
    addressLine1: cleanOptional(data.addressLine1),
    city: cleanOptional(data.city),
    zip: cleanOptional(data.zip),
    state: cleanOptional(data.state),
    howDidYouHearAboutUs: referralSource,
    nameOfSupermarket: cleanOptional(data.nameOfSupermarket),
    otherReferralDetail: cleanOptional(data.otherReferralDetail),
    brand: normalizeBrand(data.brand),
    message: requireNonEmptyString(data.message, "Message"),
  };

  if (cleaned.message.length < 10) {
    throw new Error("Message must be at least 10 characters");
  }

  if (referralSource === "store" && !cleaned.nameOfSupermarket) {
    throw new Error("Name of Supermarket is required");
  }

  if (referralSource === "other" && !cleaned.otherReferralDetail) {
    throw new Error("Please tell us how you heard about us");
  }

  if (referralSource !== "store") {
    cleaned.nameOfSupermarket = "";
  }

  if (referralSource !== "other") {
    cleaned.otherReferralDetail = "";
  }

  return cleaned;
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
  payload: CleanContactFormPayload,
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

/**
 * Validation utilities for URL slug formatting
 */
import type { SlugValidationContext } from "sanity";

export interface SlugValidationError {
  type: "required" | "format" | "characters" | "structure" | "prefix";
  message: string;
}

export interface SlugValidationOptions {
  documentType?: string;
  requiredPrefix?: string;
  allowedPrefixes?: string[];
  sanityDocumentType?: string; // Auto-configure based on Sanity document type
}

/**
 * Validates a slug string and returns array of validation errors
 */
function validateBasicStructure(slug: string): SlugValidationError[] {
  const errors: SlugValidationError[] = [];

  // Check if it starts with /
  if (!slug.startsWith("/")) {
    errors.push({
      type: "structure",
      message: "URL path must start with a forward slash (/)",
    });
  }

  // Check for double slashes
  if (slug.includes("//")) {
    errors.push({
      type: "structure",
      message: "Multiple consecutive slashes (//) are not allowed",
    });
  }

  // Check for trailing slashes
  if (slug.endsWith("/") && slug !== "/") {
    errors.push({
      type: "structure",
      message: "Trailing slashes are not recommended",
    });
  }

  return errors;
}

function validateCharacters(slug: string): SlugValidationError[] {
  const errors: SlugValidationError[] = [];

  // Check for invalid characters
  const invalidChars = slug.match(/[^a-z0-9\-/\s]/gi);
  if (invalidChars) {
    const uniqueChars = [...new Set(invalidChars)].join(", ");
    errors.push({
      type: "characters",
      message: `Invalid characters found: ${uniqueChars}`,
    });
  }

  return errors;
}

function validateFormat(slug: string): SlugValidationError[] {
  const errors: SlugValidationError[] = [];

  // Check for spaces
  if (slug.includes(" ")) {
    errors.push({
      type: "format",
      message:
        "Spaces should be replaced with hyphens (-) for SEO-friendly URLs",
    });
  }

  // Check for uppercase letters
  if (slug !== slug.toLowerCase()) {
    errors.push({
      type: "format",
      message: "URLs should be lowercase for consistency",
    });
  }

  return errors;
}

function getDocumentTypeConfig(
  sanityDocumentType: string,
): SlugValidationOptions {
  switch (sanityDocumentType) {
    case "blog":
      return {
        documentType: "Blog post",
        requiredPrefix: "/blog/",
      };
    case "sauce":
      return {
        documentType: "Sauce",
        requiredPrefix: "/sauces/",
      };
    case "product":
      return {
        documentType: "Product",
        requiredPrefix: "/store/",
      };
    case "recipe":
      return {
        documentType: "Recipe",
        requiredPrefix: "/recipes/",
      };
    case "blogIndex":
      return {
        documentType: "Blog index",
        requiredPrefix: "/blog",
      };
    case "sauceIndex":
      return {
        documentType: "Sauce index",
        requiredPrefix: "/sauces",
      };
    case "productIndex":
      return {
        documentType: "Product index",
        requiredPrefix: "/store",
      };
    case "recipeIndex":
      return {
        documentType: "Recipe index",
        requiredPrefix: "/recipes",
      };
    case "homePage":
      return {
        documentType: "Home page",
        requiredPrefix: "/",
      };
    case "historyPage":
      return {
        documentType: "History page",
        requiredPrefix: "/history",
      };
    case "storeLocator":
      return {
        documentType: "Store locator page",
        requiredPrefix: "/where-to-buy",
      };
    case "contactPage":
      return {
        documentType: "Contact page",
        requiredPrefix: "/contact",
      };
    case "page":
      return {
        documentType: "Page",
      };
    default:
      return {};
  }
}

function validatePrefixes(
  slug: string,
  options: SlugValidationOptions,
): SlugValidationError[] {
  const errors: SlugValidationError[] = [];
  const { documentType, requiredPrefix, allowedPrefixes, sanityDocumentType } =
    options;

  // Type-specific prefix validation
  if (documentType && requiredPrefix) {
    if (!slug.startsWith(requiredPrefix)) {
      errors.push({
        type: "prefix",
        message: `${documentType} URLs must start with "${requiredPrefix}"`,
      });
    }
  }

  // Check against allowed prefixes if specified
  if (allowedPrefixes && allowedPrefixes.length > 0) {
    const hasValidPrefix = allowedPrefixes.some((prefix) =>
      slug.startsWith(prefix),
    );
    if (!hasValidPrefix) {
      const prefixList = allowedPrefixes.join('", "');
      errors.push({
        type: "prefix",
        message: `URL must start with one of: "${prefixList}"`,
      });
    }
  }

  // Special validation for pages - prevent blog prefix usage
  if (sanityDocumentType === "page" && slug.startsWith("/blog")) {
    errors.push({
      type: "prefix",
      message:
        'Pages cannot use "/blog" prefix - this is reserved for blog content',
    });
  }

  return errors;
}

export function validateSlug(
  slug: string | undefined | null,
  options: SlugValidationOptions = {},
): SlugValidationError[] {
  if (!slug) {
    return [
      {
        type: "required",
        message: "URL path is required",
      },
    ];
  }

  // Auto-configure options based on Sanity document type if provided
  const finalOptions = options.sanityDocumentType
    ? { ...getDocumentTypeConfig(options.sanityDocumentType), ...options }
    : options;

  return [
    ...validateBasicStructure(slug),
    ...validateCharacters(slug),
    ...validateFormat(slug),
    ...validatePrefixes(slug, finalOptions),
  ];
}

/**
 * Validates a Sanity slug object and returns validation result
 * For use in Sanity schema validation
 */
export function validateSanitySlug(
  slug: { current?: string } | string | undefined,
  options: SlugValidationOptions = {},
): string | true {
  const slugValue =
    typeof slug === "string" ? slug : (slug as { current?: string })?.current;
  const errors = validateSlug(slugValue, options);
  return errors.length > 0
    ? errors.map((error) => error.message).join("; ")
    : true;
}

/**
 * Helper function to create type-specific validators
 */
export function createSlugValidator(
  options: SlugValidationOptions,
): (slug: { current?: string } | undefined) => string | true {
  return (slug) => validateSanitySlug(slug, options);
}

/**
 * Async uniqueness validator for slug fields that returns a descriptive message.
 * Keeps scope global (site-wide unique slugs) to match default `isUnique` behavior.
 */
export function createUniqueSlugRule() {
  return async (
    slug: { current?: string } | undefined,
    context: { document?: { _id?: string }; getClient: Function },
  ): Promise<string | true> => {
    const current = slug?.current;
    if (!current) return true; // Let required/format validators handle empties

    const { document, getClient } = context;
    const client = getClient({ apiVersion: "2025-02-19" });
    const id = (document?._id ?? "").replace(/^drafts\./, "");

    const query = `*[
      !(_id in [$draft, $published]) && slug.current == $slug
    ][0]{ _id, _type, title, name, "slug": slug.current }`;
    const params = {
      draft: `drafts.${id}`,
      published: id,
      slug: current,
    };

    const dup = await client.fetch(query, params);
    if (dup) {
      const otherTitle = dup.title || dup.name || dup.slug || dup._id;
      return `This URL is already used by "${otherTitle}"`;
    }

    return true;
  };
}

/**
 * Site-scoped async uniqueness validator for slug fields that returns a descriptive message.
 * Only checks for duplicate slugs within the same site (via site._ref).
 * For use with .custom() validation in Sanity schemas.
 */
export function createSiteScopedUniqueSlugRule(sanityDocumentType: string) {
  return async (
    slug: { current?: string } | string | undefined,
    context: {
      document?: { _id?: string; site?: { _ref?: string } };
      getClient: Function;
    },
  ): Promise<string | true> => {
    const current = typeof slug === "string" ? slug : slug?.current;
    if (!current) return true; // Let required/format validators handle empties

    const { document, getClient } = context;
    const siteRef = document?.site?._ref;
    if (!siteRef) {
      // If no site reference, allow it (site field validation will catch this)
      return true;
    }

    try {
      const client = getClient({ apiVersion: "2025-02-19" });
      const id = (document?._id ?? "").replace(/^drafts\./, "");
      const excludedIds = [id, id ? `drafts.${id}` : undefined].filter(
        (value): value is string => Boolean(value),
      );

      const query = `*[
        _type == $type &&
        site._ref == $siteRef &&
        slug.current == $slug &&
        !(_id in $excludedIds)
      ][0]{ _id, _type, title, name, "slug": slug.current }`;
      const params = {
        type: sanityDocumentType,
        siteRef,
        slug: current,
        excludedIds,
      };

      const dup = await client.fetch(query, params);
      if (dup) {
        const otherTitle = dup.title || dup.name || dup.slug || dup._id;
        return `This URL is already used by "${otherTitle}"`;
      }

      return true;
    } catch {
      // If fetch fails (network, API error), allow validation to pass to avoid blocking editors
      return true;
    }
  };
}

export const createSiteScopedSlugUniqueness = (sanityDocumentType: string) => {
  return async (
    slug: string,
    context: SlugValidationContext,
  ): Promise<boolean> => {
    if (!slug) return true;

    type SiteScopedDocument = {
      _id?: string;
      site?: {
        _ref?: string;
      };
    };

    const document = context.document as SiteScopedDocument | undefined;
    const siteRef = document?.site?._ref;
    if (!siteRef) return true;

    const baseId = document?._id?.replace(/^drafts\./, "");
    const excludedIds = [
      baseId,
      baseId ? `drafts.${baseId}` : undefined,
    ].filter((value): value is string => Boolean(value));

    const client = context.getClient({ apiVersion: "2025-02-19" });
    const duplicate = await client.fetch(
      `defined(*[
        _type == $type &&
        site._ref == $siteRef &&
        slug.current == $slug &&
        !(_id in $excludedIds)
      ][0]._id)`,
      {
        type: sanityDocumentType,
        siteRef,
        slug,
        excludedIds,
      },
    );

    return !duplicate;
  };
};

/**
 * Validates slug with auto-configured document type options
 * For use in components where you have the Sanity document type
 */
export function validateSlugForDocumentType(
  slug: string | undefined | null,
  sanityDocumentType: string,
): string[] {
  const errors = validateSlug(slug, { sanityDocumentType });
  return errors.map((error) => error.message);
}

/**
 * Cleans a slug string to make it valid
 */
export function cleanSlug(slug: string, sanityDocumentType?: string): string {
  if (!slug) return "/";

  let cleaned = slug
    // Convert to lowercase for consistency
    .toLowerCase()
    // Replace multiple slashes with single slash
    .replace(/\/+/g, "/")
    // Replace spaces with hyphens for SEO-friendly URLs
    .replace(/\s+/g, "-")
    // Remove invalid characters but keep slashes and hyphens
    .replace(/[^a-z0-9\-/]/g, "")
    // Clean up multiple hyphens
    .replace(/-+/g, "-")
    // Remove trailing slashes (except for root)
    .replace(/\/+$/, "")
    // Ensure it starts with a slash if not empty
    .replace(/^(?!\/)(.+)/, "/$1")
    // Clean up any remaining edge cases
    .replace(/\/-+/g, "/") // Remove hyphens after slashes
    .replace(/-+\//g, "/"); // Remove hyphens before slashes

  // Apply document-type specific rules
  if (sanityDocumentType) {
    cleaned = applyDocumentTypeRules(cleaned, sanityDocumentType);
  }

  return cleaned;
}

/**
 * Applies document-type specific cleaning rules
 */
function applyDocumentTypeRules(
  slug: string,
  sanityDocumentType: string,
): string {
  switch (sanityDocumentType) {
    case "blog":
      // Ensure blog posts start with /blog/
      if (!slug.startsWith("/blog/")) {
        if (slug === "/" || slug === "/blog") {
          return "/blog/untitled";
        }
        // Remove any existing prefix and add /blog/
        const cleanPath = slug.replace(/^\/+/, "");
        return `/blog/${cleanPath}`;
      }
      return slug;

    case "blogIndex":
      // Blog index should be exactly /blog
      if (slug !== "/blog") {
        return "/blog";
      }
      return slug;

    case "homePage":
      // Home page should be exactly /
      return "/";

    case "page":
      // Pages cannot use /blog prefix
      if (slug.startsWith("/blog")) {
        // Remove /blog prefix and clean up
        const withoutBlogPrefix = slug.replace(/^\/blog\/?/, "");
        if (!withoutBlogPrefix) {
          return "/page";
        }
        return `/${withoutBlogPrefix}`;
      }
      return slug;

    case "sauceIndex":
      // Sauce index should be exactly /sauces
      if (slug !== "/sauces") {
        return "/sauces";
      }
      return slug;
    case "productIndex":
      // Product index should be exactly /store
      if (slug !== "/store") {
        return "/store";
      }
      return slug;
    case "recipeIndex":
      // Recipe index should be exactly /recipes
      if (slug !== "/recipes") {
        return "/recipes";
      }
      return slug;

    case "contactPage":
      // Contact page should be exactly /contact
      if (slug !== "/contact") {
        return "/contact";
      }
      return slug;

    case "sauce":
      // Ensure sauces live under /sauces/
      if (!slug.startsWith("/sauces/")) {
        if (slug === "/" || slug === "/sauces") {
          return "/sauces/untitled";
        }
        const cleanPath = slug.replace(/^\/+/, "");
        return `/sauces/${cleanPath}`;
      }
      return slug;
    case "product":
      // Ensure products live under /store/
      if (!slug.startsWith("/store/")) {
        if (slug === "/" || slug === "/store") {
          return "/store/untitled";
        }
        const cleanPath = slug.replace(/^\/+/, "");
        return `/store/${cleanPath}`;
      }
      return slug;
    case "recipe":
      // Ensure recipes live under /recipes/
      if (!slug.startsWith("/recipes/")) {
        if (slug === "/" || slug === "/recipes") {
          return "/recipes/untitled";
        }
        const cleanPath = slug.replace(/^\/+/, "");
        return `/recipes/${cleanPath}`;
      }
      return slug;

    default:
      return slug;
  }
}

/**
 * Enhanced clean function that validates and provides suggestions
 */
export function cleanSlugWithValidation(
  slug: string,
  sanityDocumentType?: string,
): {
  cleanedSlug: string;
  wasChanged: boolean;
  changes: string[];
} {
  const original = slug;
  const changes: string[] = [];

  if (!slug) {
    return {
      cleanedSlug: "/",
      wasChanged: true,
      changes: ["Added default '/' path"],
    };
  }

  let cleaned = slug;

  // Track changes
  if (cleaned !== cleaned.toLowerCase()) {
    changes.push("Converted to lowercase");
    cleaned = cleaned.toLowerCase();
  }

  if (cleaned.includes("  ") || cleaned.includes(" ")) {
    changes.push("Replaced spaces with hyphens");
    cleaned = cleaned.replace(/\s+/g, "-");
  }

  if (cleaned.includes("//")) {
    changes.push("Fixed multiple consecutive slashes");
    cleaned = cleaned.replace(/\/+/g, "/");
  }

  const invalidCharRegex = /[^a-z0-9\-/]/;
  if (invalidCharRegex.exec(cleaned)) {
    changes.push("Removed invalid characters");
    cleaned = cleaned.replace(/[^a-z0-9\-/]/g, "");
  }

  if (cleaned.includes("--")) {
    changes.push("Fixed multiple consecutive hyphens");
    cleaned = cleaned.replace(/-+/g, "-");
  }

  if (cleaned.endsWith("/") && cleaned !== "/") {
    changes.push("Removed trailing slash");
    cleaned = cleaned.replace(/\/+$/, "");
  }

  if (!cleaned.startsWith("/") && cleaned) {
    changes.push("Added leading slash");
    cleaned = `/${cleaned}`;
  }

  // Apply document type rules
  if (sanityDocumentType) {
    const beforeTypeRules = cleaned;
    cleaned = applyDocumentTypeRules(cleaned, sanityDocumentType);
    if (beforeTypeRules !== cleaned) {
      changes.push(`Applied ${sanityDocumentType} type rules`);
    }
  }

  return {
    cleanedSlug: cleaned,
    wasChanged: original !== cleaned,
    changes,
  };
}

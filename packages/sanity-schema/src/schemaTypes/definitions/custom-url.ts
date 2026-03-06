import type { ReferenceFilterResolver, ReferenceOptions } from "sanity";
import { defineField, defineType } from "sanity";

import { createRadioListLayout, isValidUrl } from "../../utils/helper";

const siteScopedLinkableTypes = [
  "homePage",
  "page",
  "historyPage",
  "contactPage",
  "storeLocator",
  "sauceIndex",
  "recipeIndex",
  "productIndex",
] as const;

const sharedLinkableTypes = ["leadershipIndex"] as const;

type SiteScopedLinkableType = (typeof siteScopedLinkableTypes)[number];
type SharedLinkableType = (typeof sharedLinkableTypes)[number];
type LinkableType = SiteScopedLinkableType | SharedLinkableType;

const allLinkableTypes = [
  ...siteScopedLinkableTypes,
  ...sharedLinkableTypes,
].map((type) => ({ type }));

type SiteLinkDocument = {
  site?: {
    _ref?: string;
  };
};

const siteScopedTypeList = `[${siteScopedLinkableTypes
  .map((type) => `"${type}"`)
  .join(", ")}]`;
const sharedTypeList = `[${sharedLinkableTypes
  .map((type) => `"${type}"`)
  .join(", ")}]`;
const allTypeList = `[${[...siteScopedLinkableTypes, ...sharedLinkableTypes]
  .map((type) => `"${type}"`)
  .join(", ")}]`;

const siteScopedFilter = `_type in ${siteScopedTypeList} && site._ref == $siteId`;
const sharedFilter = `_type in ${sharedTypeList}`;
const combinedFilter = `(${siteScopedFilter}) || (${sharedFilter})`;

const internalReferenceOptions: ReferenceOptions = {
  disableNew: true,
  filter: (({ document }) => {
    const siteId = (document as SiteLinkDocument | undefined)?.site?._ref;
    if (!siteId) {
      return {
        filter: `_type in ${allTypeList}`,
      };
    }
    return {
      filter: combinedFilter,
      params: { siteId },
    };
  }) satisfies ReferenceFilterResolver,
};

export const customUrl = defineType({
  name: "customUrl",
  type: "object",
  description:
    "Configure a link that can point to either an internal page or external website",
  fields: [
    defineField({
      name: "type",
      type: "string",
      description:
        "Choose whether this link points to another page on your site (internal) or to a different website (external)",
      options: createRadioListLayout(["internal", "external"]),
      initialValue: () => "external",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      description:
        "When enabled, clicking this link will open the destination in a new browser tab instead of navigating away from the current page",
      initialValue: () => false,
    }),
    defineField({
      name: "external",
      type: "string",
      title: "URL",
      description:
        "Enter either a full web address (URL) starting with https:// for external sites, or a relative path like /about for internal pages",
      hidden: ({ parent }) => parent?.type !== "external",
      validation: (Rule) => [
        Rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          if (type === "external") {
            if (!value) return "URL can't be empty";
            const isValid = isValidUrl(value);
            if (!isValid) return "Invalid URL";
          }
          return true;
        }),
      ],
    }),
    defineField({
      name: "href",
      type: "string",
      description:
        "Technical field used internally to store the complete URL - you don't need to modify this",
      initialValue: () => "#",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "internal",
      type: "reference",
      description:
        "Select which page on your website this link should point to",
      options: internalReferenceOptions,
      hidden: ({ parent }) => parent?.type !== "internal",
      to: allLinkableTypes,
      validation: (rule) => [
        rule.custom((value, { parent }) => {
          const type = (parent as { type?: string })?.type;
          if (type === "internal" && !value?._ref)
            return "internal can't be empty";
          return true;
        }),
        rule.custom(async (value, context) => {
          const type = (context.parent as { type?: string })?.type;
          if (type !== "internal" || !value?._ref) return true;

          const document = context.document as SiteLinkDocument | undefined;
          const siteId = document?.site?._ref;

          const client = context.getClient({ apiVersion: "2025-02-19" });
          const referenced = await client.fetch<{
            _type?: LinkableType;
            site?: { _ref?: string };
          }>(`*[_id == $id][0]{ _type, site }`, { id: value._ref });

          if (!referenced) return true;

          const referencedSiteId = referenced.site?._ref;
          const referencedType = referenced._type;
          const isShared = sharedLinkableTypes.includes(
            referencedType as SharedLinkableType,
          );
          const isSiteScoped = siteScopedLinkableTypes.includes(
            referencedType as SiteScopedLinkableType,
          );

          if (!siteId) {
            // Without a site context, allow any shared type and any site-scoped type.
            return true;
          }

          if (isShared) return true;
          if (isSiteScoped && referencedSiteId === siteId) return true;

          return "Internal link must match the current site's content.";
        }),
      ],
    }),
  ],
  preview: {
    select: {
      externalUrl: "external",
      urlType: "type",
      internalUrl: "internal.slug.current",
      openInNewTab: "openInNewTab",
    },
    prepare({ externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : `/${internalUrl}`;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: `${urlType === "external" ? "External" : "Internal"} Link`,
        subtitle: `${truncatedUrl}${newTabIndicator}`,
      };
    },
  },
});

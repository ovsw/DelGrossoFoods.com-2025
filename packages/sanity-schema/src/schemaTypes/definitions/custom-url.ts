import { defineField, defineType } from "sanity";

import { createRadioListLayout, isValidUrl } from "../../utils/helper";

// These document types back every routable page on DGF + LFD sites.
// Keep in sync with the routes implemented under apps/web-*/src/app.
const internalLinkTargetTypes = [
  "homePage",
  "page",
  "historyPage",
  "contactPage",
  "storeLocator",
  "sauceIndex",
  "recipeIndex",
  "productIndex",
] as const;

const allLinkableTypes = internalLinkTargetTypes.map((type) => ({ type }));

type SiteLinkDocument = {
  site?: {
    _ref?: string;
  };
};

const typeList = `[${internalLinkTargetTypes
  .map((type) => `"${type}"`)
  .join(", ")}]`;
const baseTypeFilter = `_type in ${typeList}`;

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
      options: {
        disableNew: true,
        filter: baseTypeFilter,
      },
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
            _type?: string;
            site?: { _ref?: string };
          }>(`*[_id == $id][0]{ _type, site }`, { id: value._ref });

          if (!referenced) return true;

          const referencedSiteId = referenced.site?._ref;
          if (!siteId) {
            return referencedSiteId
              ? "Internal link must point to a site-specific page or a global page."
              : true;
          }

          const isGlobalPage = !referencedSiteId && referenced._type === "page";
          if (referencedSiteId === siteId || isGlobalPage) return true;

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

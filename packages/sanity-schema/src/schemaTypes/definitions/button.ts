import { Command } from "lucide-react";
import { defineField, defineType } from "sanity";

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  icon: Command,
  fields: [
    defineField({
      name: "text",
      title: "Button Text",
      type: "string",
      description:
        "The text that appears on the button, like 'Learn More' or 'Get Started'",
    }),
    defineField({
      name: "url",
      title: "Url",
      type: "customUrl",
      description:
        "Where the button links to - can be an internal page or external website",
    }),
  ],
  preview: {
    select: {
      title: "text",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare: ({ title, externalUrl, urlType, internalUrl, openInNewTab }) => {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const normalizedInternal =
        urlType === "internal" && url ? url.replace(/^\/+/, "") : url;
      const normalizedUrl =
        urlType === "internal" && normalizedInternal
          ? `/${normalizedInternal}`
          : url;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl = normalizedUrl
        ? normalizedUrl.length > 30
          ? `${normalizedUrl.substring(0, 30)}...`
          : normalizedUrl
        : "Select a URL";
      const label = urlType ? `${urlType} • ` : "";

      return {
        title: title || "Untitled Button",
        subtitle: `${label}${truncatedUrl}${newTabIndicator}`,
      };
    },
  },
});

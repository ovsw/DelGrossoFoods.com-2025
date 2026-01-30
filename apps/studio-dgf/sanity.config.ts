import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "@workspace/sanity-schema";
import {
  createPageTemplate,
  getPresentationUrl,
} from "@workspace/sanity-schema/utils/helper";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import {
  unsplashAssetSource,
  unsplashImageAsset,
} from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media, mediaAssetSource } from "sanity-plugin-media";
import { muxInput } from "sanity-plugin-mux-input";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;
const previewOrigin =
  process.env.NODE_ENV === "production"
    ? getPresentationUrl()
    : (process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:3000");
const allowedPreviewOrigins = Array.from(
  new Set(
    [
      previewOrigin,
      process.env.SANITY_STUDIO_PRESENTATION_URL,
      process.env.SANITY_STUDIO_PREVIEW_ORIGIN,
      "http://localhost:3001",
    ].filter((origin): origin is string => Boolean(origin)),
  ),
);

export default defineConfig({
  name: "default",
  title: title,
  logo: Logo,
  projectId: projectId,
  dataset: dataset ?? "production",
  plugins: [
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
      allowOrigins: allowedPreviewOrigins,
    }),
    structureTool({
      structure,
    }),
    presentationUrl(),
    visionTool(),
    unsplashImageAsset(),
    media(),
    muxInput({
      mp4_support: "standard",
    }),
    iconPicker(),
    assist(),
  ],
  form: {
    image: {
      assetSources: () => [mediaAssetSource, unsplashAssetSource],
    },
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      const { type } = creationContext;
      if (type === "global") return [];
      return prev;
    },
  },
  schema: {
    types: schemaTypes,
    templates: createPageTemplate(),
  },
});

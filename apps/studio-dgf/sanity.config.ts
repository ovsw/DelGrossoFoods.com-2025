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
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media } from "sanity-plugin-media";
import { muxInput } from "sanity-plugin-mux-input";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;

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
        origin: getPresentationUrl(),
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
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

import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import {
  defineConfig,
  type DocumentActionComponent,
  type SanityDocument,
} from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media } from "sanity-plugin-media";
import { muxInput } from "sanity-plugin-mux-input";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import { documents, singletons } from "./schemaTypes/documents";
import { structure } from "./structure";
import { createPageTemplate, getPresentationUrlForSite } from "./utils/helper";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;
const resolvedDataset = dataset ?? "production";

const siteWorkspaces = [
  {
    name: "dgf",
    title: "DGF",
    siteId: "DGF",
  },
  {
    name: "lfd",
    title: "LFD",
    siteId: "LFD",
  },
] as const;

const previewOrigins = siteWorkspaces.reduce<Record<string, string>>(
  (acc, workspace) => {
    acc[workspace.siteId] = getPresentationUrlForSite(workspace.siteId);
    return acc;
  },
  {},
);

const siteWorkspaceById = new Map<string, (typeof siteWorkspaces)[number]>(
  siteWorkspaces.map((workspace) => [workspace.siteId, workspace]),
);

// Widen to string to allow membership checks with broader unions
const singletonTypeNames = new Set<string>(
  singletons.map(({ name }) => String(name)),
);

// Widen to string to accept computed schema type names
const creatableTypeNames = new Set<string>(
  documents
    .map(({ name }) => name)
    .filter((name) => !singletonTypeNames.has(name) && name !== "site"),
);

// Widen to string for Set.has with generic string schemaType
const siteScopedTypes = new Set<string>([
  "page",
  "blog",
  "faq",
  "recipeCategory",
]);
const multiSiteTypes = new Set<string>(["product"]);

const siteSuffixes = siteWorkspaces.map(({ siteId }) => siteId.toLowerCase());

const stripDraftPrefix = (id?: string) => (id ?? "").replace(/^drafts\./, "");

const isTemplateForCurrentWorkspace = (templateId: string, siteId: string) => {
  const normalized = templateId.toLowerCase();
  return normalized.endsWith(`-${siteId.toLowerCase()}`);
};

const isTemplateForAnyWorkspace = (templateId: string) => {
  const normalized = templateId.toLowerCase();
  return siteSuffixes.some((suffix) => normalized.endsWith(`-${suffix}`));
};

const getSiteNamesFromIds = (siteIds: string[]) => {
  return siteIds
    .map(
      (id) =>
        siteWorkspaceById.get(id)?.title ??
        siteWorkspaceById.get(id)?.siteId ??
        id,
    )
    .filter(Boolean);
};

const createLockedAction = (siteNames: string[]): DocumentActionComponent => {
  const readableNames =
    siteNames.length === 1
      ? `${siteNames[0]} workspace`
      : `${siteNames.join(", ")} workspaces`;
  const LockedAction: DocumentActionComponent = (props) => ({
    disabled: true,
    label: `Locked to ${readableNames}`,
    title: `Switch to the ${readableNames} to edit this document`,
    onHandle: () => {
      props.onComplete?.();
    },
  });
  LockedAction.action = "locked" as any;
  return LockedAction;
};

const resolveLockTargets = ({
  schemaType,
  documentId,
  document,
  siteId,
}: {
  schemaType: string | undefined;
  documentId?: string;
  document?: SanityDocument;
  siteId: string;
}): string[] | null => {
  if (!schemaType) return null;

  const sanitizedId = stripDraftPrefix(documentId);

  if (singletonTypeNames.has(schemaType)) {
    const assignedSiteId = sanitizedId.split("-").pop();
    if (assignedSiteId && assignedSiteId !== siteId) {
      return [assignedSiteId];
    }
    return null;
  }

  if (siteScopedTypes.has(schemaType)) {
    const siteRef = (
      document as unknown as { site?: { _ref?: string } } | undefined
    )?.site?._ref;
    if (siteRef && siteRef !== siteId) {
      return [siteRef];
    }
    return null;
  }

  if (multiSiteTypes.has(schemaType)) {
    const siteRefs = Array.isArray(
      (document as unknown as { sites?: Array<{ _ref?: string }> } | undefined)
        ?.sites,
    )
      ? (
          (
            document as unknown as
              | { sites?: Array<{ _ref?: string }> }
              | undefined
          )?.sites ?? []
        )
          .map((entry: { _ref?: string }) => entry?._ref)
          .filter((ref): ref is string => Boolean(ref))
      : [];
    if (siteRefs.length > 0 && !siteRefs.includes(siteId)) {
      return siteRefs;
    }
  }

  return null;
};

export default defineConfig(
  siteWorkspaces.map(({ name, title: siteTitle, siteId }) => ({
    name,
    title: title ? `${title} · ${siteTitle}` : siteTitle,
    basePath: `/${name}`,
    logo: Logo,
    projectId,
    dataset: resolvedDataset,
    plugins: [
      presentationTool({
        resolve: {
          locations,
        },
        previewUrl: {
          origin: previewOrigins[siteId],
          previewMode: {
            enable: "/api/presentation-draft",
          },
        },
      }),
      structureTool({
        structure: (S, context) => structure(S, context, { siteId }),
      }),
      presentationUrl({
        workspaceSiteId: siteId,
        previewOrigins,
      }),
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
      newDocumentOptions: (prev, context) => {
        const { creationContext } = context;
        const shouldFilter =
          creationContext.type === "global" ||
          creationContext.type === "structure";
        if (!shouldFilter) {
          return prev;
        }

        return prev.filter((option) => {
          if (option.templateId) {
            if (isTemplateForCurrentWorkspace(option.templateId, siteId)) {
              return true;
            }

            if (isTemplateForAnyWorkspace(option.templateId)) {
              return false;
            }
          }

          // Access schemaType via safe cast to maintain intent without removing functionality
          const schemaTypeName = (option as unknown as { schemaType?: string })
            .schemaType;
          if (!schemaTypeName) return false;
          return creatableTypeNames.has(schemaTypeName);
        });
      },
      actions: (prev, context) => {
        const schemaTypeName: string | undefined =
          typeof context.schemaType === "object" &&
          context.schemaType &&
          "name" in (context.schemaType as Record<string, unknown>)
            ? (context.schemaType as { name?: string }).name
            : (context.schemaType as unknown as string | undefined);

        // Access draft/published via safe cast to preserve original locking logic
        const { draft, published } = (context as unknown as {
          draft?: SanityDocument;
          published?: SanityDocument;
        }) ?? { draft: undefined, published: undefined };
        const document = draft ?? published;
        const lockTargets = resolveLockTargets({
          schemaType: schemaTypeName,
          documentId: context.documentId,
          document,
          siteId,
        });

        if (!lockTargets?.length) {
          return prev;
        }

        const siteNames = getSiteNamesFromIds(lockTargets);
        return [createLockedAction(siteNames.length ? siteNames : lockTargets)];
      },
    },
    schema: {
      types: schemaTypes,
      templates: createPageTemplate(siteId),
    },
  })),
);

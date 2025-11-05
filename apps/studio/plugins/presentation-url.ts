import { EarthGlobeIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useContext } from "react";
import {
  definePlugin,
  type DocumentActionComponent,
  type DocumentActionProps,
  useClient,
  useGetFormValue,
} from "sanity";
import { PresentationContext } from "sanity/_singletons";
import { useRouter } from "sanity/router";

const ACTION_NAME = "open-in-presentation";

type PresentationUrlPluginOptions = {
  workspaceSiteId: string;
  previewOrigins: Record<string, string>;
};

const getSiteRefFromForm = (
  getFormValue: ReturnType<typeof useGetFormValue>,
): string | undefined => {
  const value = getFormValue(["site", "_ref"]);
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
};

const fetchSiteKey = async (
  client: ReturnType<typeof useClient>,
  siteRef: string | undefined,
): Promise<string | undefined> => {
  if (!siteRef) return undefined;

  try {
    const result = await client.fetch<{ key?: string } | null>(
      '*[_type == "site" && _id == $id][0]{key}',
      { id: siteRef },
    );
    const key = result?.key;
    return typeof key === "string" && key.length > 0
      ? key.toUpperCase()
      : undefined;
  } catch (error) {
    console.error("Failed to resolve site key", error);
    return undefined;
  }
};

export const presentationUrl = ({
  workspaceSiteId,
  previewOrigins,
}: PresentationUrlPluginOptions) =>
  definePlugin(() => {
    const OpenInPresentationAction: DocumentActionComponent = (
      props: DocumentActionProps,
    ) => {
      const presentation = useContext(PresentationContext);
      const getFormValue = useGetFormValue();
      const router = useRouter();
      const toast = useToast();
      const client = useClient();

      const handlePresentationOpen = async () => {
        const slug = getFormValue(["slug", "current"]);
        if (typeof slug !== "string" || slug.length === 0) {
          toast.push({
            title: "No slug found",
            status: "error",
            description:
              "Please ensure the document has a valid slug before opening presentation.",
          });
          props.onComplete?.();
          return;
        }

        const siteRef = getSiteRefFromForm(getFormValue);
        const resolvedSiteId = await fetchSiteKey(client, siteRef);
        const targetSiteId = resolvedSiteId ?? workspaceSiteId;

        if (!previewOrigins[targetSiteId]) {
          toast.push({
            title: "Missing preview origin",
            status: "error",
            description: `Set SANITY_STUDIO_PRESENTATION_URL_${targetSiteId} to preview this site.`,
          });
          props.onComplete?.();
          return;
        }

        const searchParams = new URLSearchParams({
          preview: slug,
          siteId: targetSiteId,
        });

        router.navigateUrl({
          path: `/presentation?${searchParams.toString()}`,
        });
        props.onComplete?.();
      };

      return {
        icon: EarthGlobeIcon,
        label: "Open in Presentation",
        title: "Open in Presentation",
        onHandle: handlePresentationOpen,
        disabled: props.id === "root",
        hidden: Boolean(presentation),
      };
    };

    OpenInPresentationAction.action = ACTION_NAME as any;

    return {
      name: "presentationUrl",
      document: {
        actions: (previousActions) => [
          OpenInPresentationAction,
          ...previousActions,
        ],
      },
    };
  });

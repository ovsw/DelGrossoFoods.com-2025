import { EarthGlobeIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useCallback, useContext } from "react";
import {
  defineDocumentFieldAction,
  definePlugin,
  type DocumentFieldAction,
  type DocumentFieldActionProps,
  useGetFormValue,
} from "sanity";
import { PresentationContext } from "sanity/_singletons";
import { useRouter } from "sanity/router";

const ACTION_NAME = "open-in-presentation";

type PresentationUrlPluginOptions = {
  workspaceSiteId: string;
  previewOrigins: Record<string, string>;
};

const getSiteIdFromForm = (
  getFormValue: ReturnType<typeof useGetFormValue>,
): string | undefined => {
  const value = getFormValue(["site", "_ref"]);
  if (typeof value === "string" && value.length > 0) return value;
  return undefined;
};

export const presentationUrl = ({
  workspaceSiteId,
  previewOrigins,
}: PresentationUrlPluginOptions) =>
  definePlugin(() => {
    const openInPresentationFieldAction = defineDocumentFieldAction({
      name: ACTION_NAME,
      useAction: (props: DocumentFieldActionProps) => {
        const presentation = useContext(PresentationContext);
        const getFormValue = useGetFormValue();
        const router = useRouter();
        const toast = useToast();

        const handlePresentationOpen = useCallback(() => {
          const slug = getFormValue(["slug", "current"]);
          if (typeof slug !== "string" || slug.length === 0) {
            toast.push({
              title: "No slug found",
              status: "error",
              description:
                "Please ensure the document has a valid slug before opening presentation.",
            });
            return;
          }

          const siteRef = getSiteIdFromForm(getFormValue);
          const targetSiteId = siteRef ?? workspaceSiteId;

          if (!previewOrigins[targetSiteId]) {
            toast.push({
              title: "Missing preview origin",
              status: "error",
              description: `Set SANITY_STUDIO_PRESENTATION_URL_${targetSiteId} to preview this site.`,
            });
            return;
          }

          const searchParams = new URLSearchParams({
            preview: slug,
            siteId: targetSiteId,
          });

          router.navigateUrl({
            path: `/presentation?${searchParams.toString()}`,
          });
        }, [getFormValue, router, toast, workspaceSiteId, previewOrigins]);

        return {
          type: "action" as const,
          icon: EarthGlobeIcon,
          title: "Open in Presentation",
          onAction: handlePresentationOpen,
          hidden: Boolean(presentation) || props.path.length > 0,
          renderAsButton: true,
          disabled: props.documentId === "root",
        };
      },
    });

    return {
      name: "presentationUrl",
      document: {
        unstable_fieldActions: (
          previous: DocumentFieldAction[],
        ): DocumentFieldAction[] => {
          return [openInPresentationFieldAction, ...previous];
        },
      },
    };
  });

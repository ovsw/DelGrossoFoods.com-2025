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

const openInPresentationFieldAction = defineDocumentFieldAction({
  name: ACTION_NAME,
  useAction: (props: DocumentFieldActionProps) => {
    const presentation = useContext(PresentationContext);
    const getFormValue = useGetFormValue();
    const router = useRouter();
    const toast = useToast();

    const handlePresentationOpen = useCallback(() => {
      const slug = getFormValue(["slug", "current"]);
      if (typeof slug !== "string" || !slug) {
        toast.push({
          title: "No slug found",
          status: "error",
          description:
            "Please ensure the document has a valid slug before opening presentation.",
        });
        return;
      }

      router.navigateUrl({
        path: `/presentation?preview=${encodeURIComponent(slug)}`,
      });
    }, [getFormValue, router, toast]);

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

export const presentationUrl = definePlugin(() => {
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

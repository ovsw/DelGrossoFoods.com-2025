import { EarthGlobeIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useCallback } from "react";
import {
  definePlugin,
  type DocumentActionComponent,
  useGetFormValue,
} from "sanity";
import { useRouter } from "sanity/router";

export const presentationUrl = definePlugin(() => {
  return {
    name: "presentationUrl",
    document: {
      // Use stable document actions API instead of unstable_fieldActions
      actions: (prev) => {
        const OpenInPresentationAction: DocumentActionComponent = (props) => {
          const getFormValue = useGetFormValue();
          const router = useRouter();
          const toast = useToast();

          const handle = useCallback(() => {
            const slug = getFormValue(["slug", "current"]);
            if (typeof slug !== "string" || !slug) {
              toast.push({
                title: "No slug found",
                status: "error",
                description: "Please ensure the document has a valid slug",
              });
              props.onComplete?.();
              return;
            }
            router.navigateUrl({
              path: `/presentation?preview=${encodeURIComponent(slug)}`,
            });
            // Complete the action to close popovers if any
            props.onComplete?.();
          }, [getFormValue, router, toast, props]);

          return {
            label: "Open in Presentation",
            icon: EarthGlobeIcon,
            onHandle: handle,
            disabled: props?.id === "root",
          };
        };

        return [OpenInPresentationAction, ...prev];
      },
    },
  };
});

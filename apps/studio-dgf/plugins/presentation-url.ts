import { EarthGlobeIcon } from "@sanity/icons";
import { useToast } from "@sanity/ui";
import { useCallback, useContext, useMemo } from "react";
import {
  definePlugin,
  type DocumentActionComponent,
  type DocumentActionProps,
} from "sanity";
import { PresentationContext } from "sanity/_singletons";
import { useRouter } from "sanity/router";

const OpenInPresentationAction: DocumentActionComponent = (
  props: DocumentActionProps,
) => {
  const presentation = useContext(PresentationContext);
  const router = useRouter();
  const toast = useToast();

  // Get slug from draft or published document
  const slug = useMemo(() => {
    const doc = props.draft || props.published;
    return (doc?.slug as { current?: string } | undefined)?.current;
  }, [props.draft, props.published]);

  const handlePresentationOpen = useCallback(() => {
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
  }, [slug, router, toast]);

  // Hide action if already in presentation mode or if no slug is available
  if (presentation || !slug) {
    return null;
  }

  return {
    label: "Open in Presentation",
    icon: EarthGlobeIcon,
    onHandle: handlePresentationOpen,
  };
};

export const presentationUrl = definePlugin(() => {
  return {
    name: "presentationUrl",
    document: {
      actions: (previous) => {
        return [...previous, OpenInPresentationAction];
      },
    },
  };
});

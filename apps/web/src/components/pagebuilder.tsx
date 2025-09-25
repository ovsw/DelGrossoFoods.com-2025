"use client";

import { useOptimistic } from "@sanity/visual-editing/react";
import { createDataAttribute } from "next-sanity";
import { type ComponentType, useCallback, useMemo } from "react";

import { dataset, projectId, studioUrl } from "@/config";
import type { QueryHomePageDataResult } from "@/lib/sanity/sanity.types";
import type { PageBuilderBlockTypes, PagebuilderType } from "@/types";

import { CTABlock } from "./sections/cta";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureBlock } from "./sections/feature";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { ImageLinkCards } from "./sections/image-link-cards";
import { SubscribeNewsletter } from "./sections/subscribe-newsletter";

// More specific and descriptive type aliases
type PageBuilderBlock = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number];

export interface PageBuilderProps {
  readonly pageBuilder?: PageBuilderBlock[];
  readonly id: string;
  readonly type: string;
}

interface SanityDataAttributeConfig {
  readonly id: string;
  readonly type: string;
  readonly path: string;
}

type BlockComponentMap = {
  [K in PageBuilderBlockTypes]: ComponentType<
    PagebuilderType<K> & { readonly isPageTop?: boolean }
  >;
};

// Strongly typed component mapping with proper component signatures
const BLOCK_COMPONENTS = {
  cta: CTABlock,
  faqAccordion: FaqAccordion,
  feature: FeatureBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
} satisfies BlockComponentMap;

/**
 * Helper function to create consistent Sanity data attributes
 */
function createSanityDataAttribute(config: SanityDataAttributeConfig): string {
  return createDataAttribute({
    id: config.id,
    baseUrl: studioUrl,
    projectId,
    dataset,
    type: config.type,
    path: config.path,
  }).toString();
}

/**
 * Error fallback component for unknown block types
 */
function UnknownBlockError({
  blockType,
  blockKey,
}: {
  blockType: string;
  blockKey: string;
}) {
  return (
    <div
      key={`${blockType}-${blockKey}`}
      className="flex items-center justify-center p-8 text-center text-muted-foreground bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20"
      role="alert"
      aria-label={`Unknown block type: ${blockType}`}
    >
      <div className="space-y-2">
        <p>Component not found for block type:</p>
        <code className="font-mono text-sm bg-background px-2 py-1 rounded">
          {blockType}
        </code>
      </div>
    </div>
  );
}

/**
 * Hook to handle optimistic updates for page builder blocks
 */
function useOptimisticPageBuilder(
  initialBlocks: PageBuilderBlock[],
  documentId: string,
) {
  return useOptimistic<PageBuilderBlock[], any>(
    initialBlocks,
    (currentBlocks, action) => {
      if (action.id === documentId && action.document?.pageBuilder) {
        return action.document.pageBuilder;
      }
      return currentBlocks;
    },
  );
}

/**
 * Custom hook for block component rendering logic
 */
function useBlockRenderer(id: string, type: string) {
  const createBlockDataAttribute = useCallback(
    (blockKey: string) =>
      createSanityDataAttribute({
        id,
        type,
        path: `pageBuilder[_key=="${blockKey}"]`,
      }),
    [id, type],
  );

  const renderBlock = useCallback(
    (block: PageBuilderBlock, isFirstBlock: boolean) => {
      const { _key, _type } = block;
      const dataAttribute = createBlockDataAttribute(_key);

      switch (_type) {
        case "cta": {
          const Component = BLOCK_COMPONENTS.cta;
          return (
            <div key={`cta-${_key}`} data-sanity={dataAttribute}>
              <Component {...block} isPageTop={isFirstBlock} />
            </div>
          );
        }
        case "faqAccordion": {
          const Component = BLOCK_COMPONENTS.faqAccordion;
          return (
            <div key={`faqAccordion-${_key}`} data-sanity={dataAttribute}>
              <Component {...block} isPageTop={isFirstBlock} />
            </div>
          );
        }
        case "feature": {
          const Component = BLOCK_COMPONENTS.feature;
          return (
            <div key={`feature-${_key}`} data-sanity={dataAttribute}>
              <Component {...block} isPageTop={isFirstBlock} />
            </div>
          );
        }
        case "featureCardsIcon": {
          const Component = BLOCK_COMPONENTS.featureCardsIcon;
          return (
            <div key={`featureCardsIcon-${_key}`} data-sanity={dataAttribute}>
              <Component {...block} isPageTop={isFirstBlock} />
            </div>
          );
        }
        case "subscribeNewsletter": {
          const Component = BLOCK_COMPONENTS.subscribeNewsletter;
          return (
            <div
              key={`subscribeNewsletter-${_key}`}
              data-sanity={dataAttribute}
            >
              <Component {...block} isPageTop={isFirstBlock} />
            </div>
          );
        }
        case "imageLinkCards": {
          const Component = BLOCK_COMPONENTS.imageLinkCards;
          return (
            <div key={`imageLinkCards-${_key}`} data-sanity={dataAttribute}>
              <Component {...block} isPageTop={isFirstBlock} />
            </div>
          );
        }
        default:
          return (
            <UnknownBlockError
              key={`${_type}-${_key}`}
              blockType={_type}
              blockKey={_key}
            />
          );
      }
    },
    [createBlockDataAttribute],
  );

  return { renderBlock };
}

/**
 * PageBuilder component for rendering dynamic content blocks from Sanity CMS
 */
export function PageBuilder({
  pageBuilder: initialBlocks = [],
  id,
  type,
}: PageBuilderProps) {
  const blocks = useOptimisticPageBuilder(initialBlocks, id);
  const { renderBlock } = useBlockRenderer(id, type);

  const containerDataAttribute = useMemo(
    () => createSanityDataAttribute({ id, type, path: "pageBuilder" }),
    [id, type],
  );

  if (!blocks.length) {
    return null;
  }

  return (
    <section
      className="page-builder max-w-7xl mx-auto w-full"
      data-sanity={containerDataAttribute}
      aria-label="Page content"
    >
      {blocks.map((block, index) => renderBlock(block, index === 0))}
    </section>
  );
}

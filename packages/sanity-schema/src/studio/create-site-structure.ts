import type { ComponentType } from "react";
import {
  ClockIcon,
  DocumentTextIcon,
  DropIcon,
  MarkerIcon,
  PackageIcon,
  TagIcon,
} from "@sanity/icons";
import {
  CogIcon,
  File,
  HomeIcon,
  MessageCircle,
  PanelBottom,
  PanelBottomIcon,
  Settings2,
  StoreIcon,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import { resolveSiteDocumentId, type SiteCode } from "../site";
import type { SchemaType, SingletonType } from "../schemaTypes";
import { getTitleCase } from "../utils/helper";

type Icon = ComponentType | undefined;

type SingletonConfig = {
  type: SingletonType;
  title: string;
  icon?: Icon;
};

type CollectionConfig = {
  type: SchemaType;
  title: string;
  icon?: Icon;
  siteScoped?: boolean;
};

type IndexCollectionConfig = {
  index: SingletonConfig;
  collection: CollectionConfig;
};

const SITE_SINGLETONS: SingletonConfig[] = [
  { type: "homePage", title: "Home Page", icon: HomeIcon },
  { type: "historyPage", title: "History Page", icon: ClockIcon },
  { type: "contactPage", title: "Contact Page", icon: MessageCircle },
];

const INDEXED_COLLECTIONS: IndexCollectionConfig[] = [
  {
    index: { type: "sauceIndex", title: "Sauce Index Page", icon: DropIcon },
    collection: { type: "sauce", title: "Sauces", icon: DropIcon },
  },
  {
    index: {
      type: "productIndex",
      title: "Product Index Page",
      icon: PackageIcon,
    },
    collection: { type: "product", title: "Products", icon: PackageIcon },
  },
  {
    index: {
      type: "recipeIndex",
      title: "Recipe Index Page",
      icon: DocumentTextIcon,
    },
    collection: { type: "recipe", title: "Recipes", icon: DocumentTextIcon },
  },
];

const SITE_SCOPED_COLLECTIONS: CollectionConfig[] = [
  { type: "page", title: "Pages", siteScoped: true },
  {
    type: "recipeCategory",
    title: "Recipe Categories",
    icon: TagIcon,
    siteScoped: true,
  },
];

const SHARED_COLLECTIONS: CollectionConfig[] = [
  { type: "faq", title: "FAQs", icon: MessageCircle },
];

const SITE_CONFIGURATION_SINGLETONS: SingletonConfig[] = [
  { type: "navbar", title: "Navigation", icon: PanelBottom },
  { type: "footer", title: "Footer", icon: PanelBottomIcon },
  { type: "settings", title: "Global Settings", icon: CogIcon },
];

type SiteStructureOptions = {
  siteCode: SiteCode;
  includeSiteDocument?: boolean;
};

const getSiteSingletonDocumentId = (
  type: SingletonConfig["type"],
  siteCode: SiteCode,
) => `${type}-${siteCode}`;

const createSingletonListItem = (
  S: StructureBuilder,
  config: SingletonConfig,
  siteCode: SiteCode,
) =>
  S.listItem()
    .title(config.title ?? getTitleCase(config.type))
    .icon(config.icon ?? File)
    .child(
      S.document()
        .schemaType(config.type)
        .documentId(getSiteSingletonDocumentId(config.type, siteCode)),
    );

const createCollectionListItem = (
  S: StructureBuilder,
  config: CollectionConfig,
  siteDocumentId: string,
) => {
  const title = config.title ?? getTitleCase(config.type);
  const icon = config.icon ?? File;

  if (config.siteScoped) {
    return S.listItem()
      .title(title)
      .icon(icon)
      .child(
        S.documentList()
          .title(title)
          .filter("_type == $type && site._ref == $siteId")
          .params({ type: config.type, siteId: siteDocumentId }),
      );
  }

  return S.documentTypeListItem(config.type).title(title).icon(icon);
};

const createIndexedCollectionItem = (
  S: StructureBuilder,
  config: IndexCollectionConfig,
  siteCode: SiteCode,
  siteDocumentId: string,
) =>
  S.listItem()
    .title(config.collection.title)
    .icon(config.index.icon ?? File)
    .child(
      S.list()
        .title(config.index.title)
        .items([
          createSingletonListItem(S, config.index, siteCode),
          createCollectionListItem(S, config.collection, siteDocumentId),
        ]),
    );

const createWhereToBuyListItem = (
  S: StructureBuilder,
  siteCode: SiteCode,
  siteDocumentId: string,
) =>
  S.listItem()
    .title("Where to Buy")
    .icon(MarkerIcon)
    .child(
      S.list()
        .title("Where to Buy")
        .items([
          createSingletonListItem(
            S,
            {
              type: "storeLocator",
              title: "Where to Buy Page",
              icon: MarkerIcon,
            },
            siteCode,
          ),
          S.documentTypeListItem("retailer")
            .title("Retailers List")
            .icon(StoreIcon),
        ]),
    );

const createSiteDocumentListItem = (
  S: StructureBuilder,
  siteDocumentId: string,
) =>
  S.listItem()
    .title("Site Details")
    .icon(Settings2)
    .child(S.document().schemaType("site").documentId(siteDocumentId));

export const createSiteStructure = ({
  siteCode,
  includeSiteDocument = false,
}: SiteStructureOptions) => {
  const siteDocumentId = resolveSiteDocumentId(siteCode);

  return (S: StructureBuilder, _context: StructureResolverContext) => {
    const [primarySiteCollection, ...secondarySiteCollections] =
      SITE_SCOPED_COLLECTIONS;

    const items = [
      includeSiteDocument
        ? createSiteDocumentListItem(S, siteDocumentId)
        : null,
      ...SITE_SINGLETONS.map((config) =>
        createSingletonListItem(S, config, siteCode),
      ),
      S.divider(),
      primarySiteCollection
        ? createCollectionListItem(S, primarySiteCollection, siteDocumentId)
        : null,
      ...INDEXED_COLLECTIONS.map((config) =>
        createIndexedCollectionItem(S, config, siteCode, siteDocumentId),
      ),
      createWhereToBuyListItem(S, siteCode, siteDocumentId),
      ...secondarySiteCollections.map((config) =>
        createCollectionListItem(S, config, siteDocumentId),
      ),
      ...SHARED_COLLECTIONS.map((config) =>
        createCollectionListItem(S, config, siteDocumentId),
      ),
      S.divider(),
      S.listItem()
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .title("Site Configuration")
            .items(
              SITE_CONFIGURATION_SINGLETONS.map((config) =>
                createSingletonListItem(S, config, siteCode),
              ),
            ),
        ),
    ].filter(Boolean);

    return S.list()
      .title("Content")
      .items(items as any);
  };
};

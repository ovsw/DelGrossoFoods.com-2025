import {
  ClockIcon,
  DocumentTextIcon,
  DropIcon,
  MarkerIcon,
  PackageIcon,
  TagIcon,
} from "@sanity/icons";
import {
  isSiteCode,
  resolveSiteDocumentId,
  type SchemaType,
  type SingletonType,
} from "@workspace/sanity-schema";
import { getTitleCase } from "@workspace/sanity-schema/utils/helper";
import {
  CogIcon,
  File,
  HomeIcon,
  MessageCircle,
  PanelBottom,
  PanelBottomIcon,
  Settings2,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  preview?: boolean;
  title?: string;
  icon?: React.ComponentType;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const siteCodeEnv = process.env.SANITY_STUDIO_SITE_ID;
const siteDocumentId =
  siteCodeEnv && isSiteCode(siteCodeEnv)
    ? resolveSiteDocumentId(siteCodeEnv)
    : undefined;

const SITE_SCOPED_TYPES = new Set([
  "contactPage",
  "faq",
  "footer",
  "historyPage",
  "homePage",
  "navbar",
  "page",
  "productIndex",
  "recipeCategory",
  "recipeIndex",
  "settings",
  "sauceIndex",
  "storeLocator",
]);

// This function creates a list item for a "singleton" document type.
// Singleton documents are unique documents like a homepage or global settings.
// The list item's child is the document form for that singleton.
const createSingleTon = ({ S, type, title, icon }: CreateSingleTon) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type));
};

type CreateList = {
  S: StructureBuilder;
  siteDocumentId?: string;
} & Base;

// This function creates a list item for a type. It takes a StructureBuilder instance (S),
// a type, an icon, and a title as parameters. It generates a title for the type if not provided,
// and uses a default icon if not provided. It then returns a list item with the generated or
// provided title and icon.

const createList = ({
  S,
  type,
  icon,
  title,
  id,
  siteDocumentId,
}: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  const itemId = id ?? type;

  if (
    siteDocumentId &&
    typeof type === "string" &&
    SITE_SCOPED_TYPES.has(type)
  ) {
    return S.listItem()
      .id(itemId)
      .title(newTitle)
      .icon(icon ?? File)
      .child(
        S.documentList()
          .title(newTitle)
          .filter("_type == $type && site._ref == $siteId")
          .params({ type, siteId: siteDocumentId }),
      );
  }

  return S.documentTypeListItem(type)
    .id(itemId)
    .title(newTitle)
    .icon(icon ?? File);
};

type CreateIndexList = {
  S: StructureBuilder;
  list: Base;
  index: Base<SingletonType>;
  context: StructureResolverContext;
  siteDocumentId?: string;
};

const createIndexList = ({
  S,
  list,
  index,
  context,
  siteDocumentId,
}: CreateIndexList) => {
  const indexTitle = index.title ?? getTitleCase(index.type);
  const listTitle = list.title ?? getTitleCase(list.type);
  return S.listItem()
    .title(listTitle)
    .icon(index.icon ?? File)
    .child(
      S.list()
        .title(indexTitle)
        .items([
          S.listItem()
            .title(indexTitle)
            .icon(index.icon ?? File)
            .child(
              S.document()
                .views([S.view.form()])
                .schemaType(index.type)
                .documentId(index.type),
            ),
          createList({
            S,
            type: list.type,
            title: list.title,
            icon: list.icon,
            siteDocumentId,
          }),
        ]),
    );
};

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  return S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage", icon: HomeIcon }),
      createSingleTon({
        S,
        type: "historyPage",
        title: "History Page",
        icon: ClockIcon,
      }),
      createSingleTon({
        S,
        type: "storeLocator",
        title: "Store Locator Page",
        icon: MarkerIcon,
      }),
      createSingleTon({
        S,
        type: "contactPage",
        title: "Contact Page",
        icon: MessageCircle,
      }),
      S.divider(),
      createList({
        S,
        type: "page",
        title: "Pages",
        siteDocumentId,
      }),
      createIndexList({
        S,
        index: { type: "sauceIndex", icon: DropIcon },
        list: { type: "sauce", title: "Sauces", icon: DropIcon },
        context,
        siteDocumentId,
      }),
      createIndexList({
        S,
        index: { type: "productIndex", icon: PackageIcon },
        list: { type: "product", title: "Products", icon: PackageIcon },
        context,
        siteDocumentId,
      }),
      createIndexList({
        S,
        index: { type: "recipeIndex", icon: DocumentTextIcon },
        list: { type: "recipe", title: "Recipes", icon: DocumentTextIcon },
        context,
        siteDocumentId,
      }),
      createList({
        S,
        type: "recipeCategory",
        title: "Recipe Categories",
        icon: TagIcon,
        siteDocumentId,
      }),
      createList({
        S,
        type: "faq",
        title: "FAQs",
        icon: MessageCircle,
        siteDocumentId,
      }),
      S.divider(),
      S.listItem()
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              createSingleTon({
                S,
                type: "navbar",
                title: "Navigation",
                icon: PanelBottom,
              }),
              createSingleTon({
                S,
                type: "footer",
                title: "Footer",
                icon: PanelBottomIcon,
              }),
              createSingleTon({
                S,
                type: "settings",
                title: "Global Settings",
                icon: CogIcon,
              }),
            ]),
        ),
    ]);
};

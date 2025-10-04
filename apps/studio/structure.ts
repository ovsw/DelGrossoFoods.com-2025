import {
  ClockIcon,
  DocumentTextIcon,
  DropIcon,
  MarkerIcon,
  PackageIcon,
  TagIcon,
} from "@sanity/icons";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  BookMarked,
  CogIcon,
  File,
  FileText,
  HomeIcon,
  MessageCircle,
  PanelBottom,
  PanelBottomIcon,
  Settings2,
  User,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import type { SchemaType, SingletonType } from "./schemaTypes";
import { getTitleCase } from "./utils/helper";

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
} & Base;

// This function creates a list item for a type. It takes a StructureBuilder instance (S),
// a type, an icon, and a title as parameters. It generates a title for the type if not provided,
// and uses a default icon if not provided. It then returns a list item with the generated or
// provided title and icon.

const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle)
    .icon(icon ?? File);
};

type CreateIndexList = {
  S: StructureBuilder;
  list: Base;
  index: Base<SingletonType>;
  context: StructureResolverContext;
};

const createIndexList = ({ S, list, index, context }: CreateIndexList) => {
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
          }),
        ]),
    );
};

// This function creates a list item for an "index" document (like a blog index page).
// Its child is a list containing the index document itself and an orderable list of related documents.
const createIndexListWithOrderableItems = ({
  S,
  index,
  list,
  context,
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
          orderableDocumentListDeskItem({
            type: list.type,
            S,
            context,
            icon: list.icon ?? File,
            title: `${listTitle}`,
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
      S.divider(),
      createList({ S, type: "page", title: "Pages" }),
      createIndexList({
        S,
        index: { type: "sauceIndex", icon: DropIcon },
        list: { type: "sauce", title: "Sauces", icon: DropIcon },
        context,
      }),
      createIndexList({
        S,
        index: { type: "productIndex", icon: PackageIcon },
        list: { type: "product", title: "Products", icon: PackageIcon },
        context,
      }),
      createIndexList({
        S,
        index: { type: "recipeIndex", icon: DocumentTextIcon },
        list: { type: "recipe", title: "Recipes", icon: DocumentTextIcon },
        context,
      }),
      createList({
        S,
        type: "recipeCategory",
        title: "Recipe Categories",
        icon: TagIcon,
      }),
      createIndexListWithOrderableItems({
        S,
        index: { type: "blogIndex", icon: BookMarked },
        list: { type: "blog", title: "Blogs", icon: FileText },
        context,
      }),
      createList({
        S,
        type: "faq",
        title: "FAQs",
        icon: MessageCircle,
      }),
      createList({ S, type: "author", title: "Authors", icon: User }),
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

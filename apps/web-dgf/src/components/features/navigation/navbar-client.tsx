"use client";

import type {
  DgfGlobalSeoSettingsQueryResult,
  DgfNavbarQueryResult,
  IconPicker,
} from "@workspace/sanity-config/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { NavbarShell } from "@workspace/ui/components/navbar-shell";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { SanityButtons } from "@workspace/ui/components/sanity-buttons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import type { RootProps } from "@workspace/ui/lib/data-attributes";
import { cn } from "@workspace/ui/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { stegaClean } from "next-sanity";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import LogoSvg from "@/components/elements/logo";
import { SanityIcon } from "@/components/elements/sanity-icon";
import { createPresentationDataAttribute } from "@/lib/sanity/presentation";

type NavbarData = NonNullable<DgfNavbarQueryResult>;
type NavbarLinkEntry = NonNullable<NavbarData["columns"]>[number];
type NavbarColumnLinkEntry = {
  _key: string;
  name: string | null;
  description: string | null;
  icon?: IconPicker | null;
  href: string | null;
  openInNewTab?: boolean | null;
};
type NavbarColumnEntry = {
  _key: string;
  type: "column";
  title: string | null;
  links?: NavbarColumnLinkEntry[] | null;
};
type NavbarEntry = NavbarLinkEntry | NavbarColumnEntry;

type PresentationAttributeGetter = (path?: string | null) => string | null;

interface MenuItem {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  linkProps?: RootProps<HTMLAnchorElement>;
}

function normalizeHref(href?: string | null): string {
  if (!href) return "/";
  return href.startsWith("/") ? href : `/${href}`;
}

function isActiveRoute(currentPath: string, href?: string | null): boolean {
  const path = currentPath || "/";
  const target = normalizeHref(href);
  if (target === "/") return path === "/";
  return path === target || path.startsWith(`${target}/`);
}

function escapeKey(value?: string | null) {
  if (!value) return "";
  return value.replace(/"/g, '\\"');
}

function createDataAttributeGetter(
  documentId?: string | null,
  documentType?: string | null,
): PresentationAttributeGetter {
  return (path) => {
    if (!documentId || !documentType || !path) return null;
    return createPresentationDataAttribute({
      documentId,
      documentType,
      path,
    });
  };
}

function toDataProps<T extends HTMLElement = HTMLElement>(
  attribute?: string | null,
) {
  return attribute ? ({ "data-sanity": attribute } as RootProps<T>) : undefined;
}

function MenuItemLink({
  item,
  setIsOpen,
  active,
}: {
  item: MenuItem;
  setIsOpen?: (isOpen: boolean) => void;
  active?: boolean;
}) {
  return (
    <Link
      className={cn(
        "flex select-none items-center gap-4 rounded-md p-3 leading-none outline-none transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      )}
      aria-label={
        item.title
          ? `Link to ${stegaClean(item.title)}`
          : item.href
            ? `Link to ${stegaClean(item.href)}`
            : undefined
      }
      aria-current={active ? "page" : undefined}
      onClick={() => setIsOpen?.(false)}
      href={item.href ?? "/"}
      {...item.linkProps}
    >
      {item.icon}
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description ? (
          <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function MobileNavbarAccordionColumn({
  column,
  setIsOpen,
  currentPath,
  getDataAttribute,
}: {
  column: NavbarEntry;
  setIsOpen: (isOpen: boolean) => void;
  currentPath: string;
  getDataAttribute: PresentationAttributeGetter;
}) {
  if (column.type !== "column") return null;
  const columnKey = escapeKey(column._key);
  const columnTitleProps = toDataProps<HTMLButtonElement>(
    columnKey
      ? getDataAttribute(`columns[_key == "${columnKey}"].title`)
      : null,
  );

  return (
    <AccordionItem
      value={column.title ?? column._key}
      className="border-b-0"
      {...toDataProps(
        columnKey ? getDataAttribute(`columns[_key == "${columnKey}"]`) : null,
      )}
    >
      <AccordionTrigger
        className="mb-4 rounded-md pr-2 py-0 font-semibold hover:bg-accent hover:text-accent-foreground hover:no-underline"
        {...columnTitleProps}
      >
        <div
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          {column.title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {column.links?.map((item) => {
          const linkKey = escapeKey(item._key);
          const linkProps = toDataProps<HTMLAnchorElement>(
            columnKey && linkKey
              ? getDataAttribute(
                  `columns[_key == "${columnKey}"].links[_key == "${linkKey}"]`,
                )
              : null,
          );
          return (
            <MenuItemLink
              key={item._key}
              setIsOpen={setIsOpen}
              active={isActiveRoute(currentPath, item.href)}
              item={{
                description: item.description ?? "",
                href: item.href ?? "",
                icon: (
                  <SanityIcon icon={item.icon} className="size-5 shrink-0" />
                ),
                title: item.name ?? "",
                linkProps,
              }}
            />
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileNavbar({
  navbarData,
  settingsData,
  currentPath,
  getDataAttribute,
  buttonRootProps,
  buttonsContainerProps,
}: {
  navbarData: NavbarData;
  settingsData: DgfGlobalSeoSettingsQueryResult;
  currentPath: string;
  getDataAttribute: PresentationAttributeGetter;
  buttonRootProps: (RootProps<HTMLAnchorElement> | undefined)[];
  buttonsContainerProps?: RootProps<HTMLDivElement>;
}) {
  const { siteTitle } = settingsData ?? {};
  const { columns, buttons } = navbarData;
  const [isOpen, setIsOpen] = useState(false);

  const rawPath = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only close the sheet when the pathname changes.
  useEffect(() => {
    setIsOpen(false);
  }, [rawPath]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-end">
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="max-w-[130px]">
              <LogoSvg className="h-7" aria-label={siteTitle ?? "Logo"} />
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="mb-8 mt-8 flex flex-col gap-4">
          {columns?.map((item) => {
            if (item.type === "link") {
              const linkKey = escapeKey(item._key);
              const linkProps = toDataProps<HTMLAnchorElement>(
                linkKey
                  ? getDataAttribute(`columns[_key == "${linkKey}"]`)
                  : null,
              );
              return (
                <Link
                  key={`column-link-${item.name}-${item._key}`}
                  href={item.href ?? ""}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start",
                    isActiveRoute(currentPath, item.href)
                      ? "bg-accent text-accent-foreground"
                      : undefined,
                  )}
                  aria-current={
                    isActiveRoute(currentPath, item.href) ? "page" : undefined
                  }
                  {...linkProps}
                >
                  {item.name}
                </Link>
              );
            }
            return (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                key={item._key}
              >
                <MobileNavbarAccordionColumn
                  column={item}
                  setIsOpen={setIsOpen}
                  currentPath={currentPath}
                  getDataAttribute={getDataAttribute}
                />
              </Accordion>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <SanityButtons
            buttons={buttons ?? []}
            buttonClassName="w-full"
            className="mt-2 flex flex-col gap-3"
            rootProps={buttonsContainerProps}
            buttonRootProps={buttonRootProps}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NavbarColumnLink({
  column,
  currentPath,
  getDataAttribute,
}: {
  column: Extract<NavbarEntry, { type: "link" }>;
  currentPath: string;
  getDataAttribute: PresentationAttributeGetter;
}) {
  const columnKey = escapeKey(column._key);
  return (
    <Link
      aria-label={`Link to ${column.name ?? column.href}`}
      href={column.href ?? ""}
      className={cn(
        navigationMenuTriggerStyle(),
        isActiveRoute(currentPath, column.href)
          ? "font-semibold text-foreground"
          : "text-muted-foreground",
      )}
      aria-current={
        isActiveRoute(currentPath, column.href) ? "page" : undefined
      }
      {...toDataProps<HTMLAnchorElement>(
        columnKey ? getDataAttribute(`columns[_key == "${columnKey}"]`) : null,
      )}
    >
      {column.name}
    </Link>
  );
}

function getColumnLayoutClass(itemCount: number) {
  if (itemCount <= 4) return "w-80";
  if (itemCount <= 8) return "grid w-[500px] grid-cols-2 gap-2";
  return "grid w-[700px] grid-cols-3 gap-2";
}

function NavbarColumn({
  column,
  currentPath,
  getDataAttribute,
}: {
  column: Extract<NavbarEntry, { type: "column" }>;
  currentPath: string;
  getDataAttribute: PresentationAttributeGetter;
}) {
  const columnKey = escapeKey(column._key);
  const columnPath = columnKey ? `columns[_key == "${columnKey}"]` : null;
  const columnTitlePath = columnKey ? `${columnPath}.title` : null;
  const layoutClass = useMemo(
    () => getColumnLayoutClass(column.links?.length ?? 0),
    [column.links?.length],
  );
  const isColumnActive =
    column.links?.some((link) => isActiveRoute(currentPath, link.href)) ??
    false;

  return (
    <NavigationMenuList
      {...toDataProps(columnPath ? getDataAttribute(columnPath) : null)}
    >
      <NavigationMenuItem className="text-muted-foreground">
        <NavigationMenuTrigger
          className={cn(isColumnActive ? "font-semibold text-foreground" : "")}
          {...toDataProps<HTMLButtonElement>(
            columnTitlePath ? getDataAttribute(columnTitlePath) : null,
          )}
        >
          {column.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={cn("p-3", layoutClass)}>
            {column.links?.map((item) => {
              const linkKey = escapeKey(item._key);
              const linkPath =
                columnKey && linkKey
                  ? `columns[_key == "${columnKey}"].links[_key == "${linkKey}"]`
                  : null;
              return (
                <li key={item._key}>
                  <MenuItemLink
                    item={{
                      title: item.name ?? "",
                      description: item.description ?? "",
                      href: item.href ?? "",
                      icon: (
                        <SanityIcon
                          icon={item.icon}
                          className="size-5 shrink-0"
                        />
                      ),
                      linkProps: toDataProps<HTMLAnchorElement>(
                        linkPath ? getDataAttribute(linkPath) : null,
                      ),
                    }}
                    active={isActiveRoute(currentPath, item.href)}
                  />
                </li>
              );
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

function DesktopNavigation({
  columns,
  currentPath,
  getDataAttribute,
}: {
  columns: NavbarEntry[] | null | undefined;
  currentPath: string;
  getDataAttribute: PresentationAttributeGetter;
}) {
  return (
    <nav aria-label="Primary" className="w-full">
      <NavigationMenu>
        {columns?.map((column) =>
          column.type === "column" ? (
            <NavbarColumn
              key={`nav-${column._key}`}
              column={column}
              currentPath={currentPath}
              getDataAttribute={getDataAttribute}
            />
          ) : (
            <NavbarColumnLink
              key={`nav-${column._key}`}
              column={column}
              currentPath={currentPath}
              getDataAttribute={getDataAttribute}
            />
          ),
        )}
      </NavigationMenu>
    </nav>
  );
}

function NavbarActions({
  buttons,
  buttonRootProps,
  buttonsContainerProps,
}: {
  buttons: NavbarData["buttons"];
  buttonRootProps: (RootProps<HTMLAnchorElement> | undefined)[];
  buttonsContainerProps?: RootProps<HTMLDivElement>;
}) {
  if (!buttons?.length) return null;
  return (
    <SanityButtons
      buttons={buttons}
      className="flex items-center gap-4"
      buttonClassName="rounded-[10px]"
      rootProps={buttonsContainerProps}
      buttonRootProps={buttonRootProps}
    />
  );
}

type NavbarClientProps = {
  navbarData: DgfNavbarQueryResult;
  settingsData: DgfGlobalSeoSettingsQueryResult;
  navbarDocumentId?: string | null;
  navbarDocumentType?: string | null;
};

export function NavbarClient({
  navbarData,
  settingsData,
  navbarDocumentId,
  navbarDocumentType,
}: NavbarClientProps) {
  const path = usePathname();
  const currentPath = path ?? "/";

  if (!navbarData) return null;

  const ensuredNavbarData = navbarData as NavbarData;
  const getDataAttribute = createDataAttributeGetter(
    navbarDocumentId,
    navbarDocumentType,
  );
  const columns = ensuredNavbarData.columns;
  const buttons = ensuredNavbarData.buttons;

  const buttonsContainerProps = toDataProps<HTMLDivElement>(
    getDataAttribute("buttons"),
  );
  const buttonRootProps =
    buttons?.map((button, index) => {
      const buttonKey = escapeKey(button?._key);
      const buttonPath = buttonKey
        ? `buttons[_key == "${buttonKey}"]`
        : `buttons[${index}]`;
      return toDataProps<HTMLAnchorElement>(getDataAttribute(buttonPath));
    }) ?? [];

  const brandSlot = (
    <Link
      href="/"
      aria-label={settingsData?.siteTitle ?? "Logo"}
      className="flex items-center gap-3 text-brand-green-text"
    >
      <LogoSvg className="h-10 w-auto" />
    </Link>
  );

  return (
    <NavbarShell
      brandSlot={brandSlot}
      desktopNavigationSlot={
        <DesktopNavigation
          columns={columns}
          currentPath={currentPath}
          getDataAttribute={getDataAttribute}
        />
      }
      desktopActionsSlot={
        <NavbarActions
          buttons={buttons}
          buttonRootProps={buttonRootProps}
          buttonsContainerProps={buttonsContainerProps}
        />
      }
      mobileMenuSlot={
        <MobileNavbar
          navbarData={ensuredNavbarData}
          settingsData={settingsData}
          currentPath={currentPath}
          getDataAttribute={getDataAttribute}
          buttonRootProps={buttonRootProps}
          buttonsContainerProps={buttonsContainerProps}
        />
      }
      background="surface"
      border="subtle"
      padding="default"
      sticky={false}
      rootProps={toDataProps(getDataAttribute("columns"))}
    />
  );
}

function SkeletonMobileNavbar() {
  return (
    <div className="md:hidden">
      <div className="flex justify-end">
        <div className="h-12 w-12 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}

function SkeletonDesktopNavbar() {
  return (
    <div className="hidden w-full grid-cols-[1fr_auto] items-center gap-8 md:grid">
      <div className="flex max-w-max flex-1 items-center justify-center gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`nav-item-skeleton-${index.toString()}`}
            className="h-12 w-32 animate-pulse rounded bg-muted"
          />
        ))}
      </div>

      <div className="justify-self-end">
        <div className="flex items-center gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`nav-button-skeleton-${index.toString()}`}
              className="h-12 w-32 animate-pulse rounded-[10px] bg-muted"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function NavbarSkeletonResponsive() {
  return (
    <>
      <SkeletonMobileNavbar />
      <SkeletonDesktopNavbar />
    </>
  );
}

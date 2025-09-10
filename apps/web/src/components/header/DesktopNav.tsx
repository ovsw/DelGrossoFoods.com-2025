import { NavLink } from "./NavLink";

interface DesktopNavProps {
  navigationLinks: { href: string; label: string }[];
  currentPath?: string;
}

export function DesktopNav({ navigationLinks, currentPath }: DesktopNavProps) {
  return (
    <div className="hidden lg:block">
      <ul className="flex items-baseline space-x-6 xl:space-x-8">
        {navigationLinks.map((link) => {
          const isActive =
            currentPath === link.href ||
            (currentPath ? currentPath.startsWith(`${link.href}/`) : false);
          return (
            <li key={link.href}>
              <NavLink href={link.href} isActive={isActive}>
                {link.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

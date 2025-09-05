import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

interface DesktopNavProps {
  navigationLinks: { href: string; label: string }[];
}

export function DesktopNav({ navigationLinks }: DesktopNavProps) {
  return (
    <div className="hidden lg:block">
      <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
        {navigationLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-md px-2 py-2 font-medium whitespace-nowrap text-amber-900",
              "transition-colors duration-200 hover:text-amber-800 xl:px-3",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

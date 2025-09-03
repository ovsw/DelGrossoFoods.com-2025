"use client";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  // When the theme changes, update the "theme" cookie to persist the user's preference.
  // If the theme is "dark" or "light", set the cookie to that value for 1 year.
  // If the theme is "system" or undefined, clear the cookie.
  useEffect(() => {
    try {
      if (theme === "dark" || theme === "light") {
        document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;
      } else {
        document.cookie = `theme=; Path=/; Max-Age=0; SameSite=Lax`;
      }
    } catch {
      // Ignore errors (e.g., if document is not available)
    }
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-[10px]">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

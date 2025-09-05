import { useEffect, useState } from "react";

interface UseScrollVisibilityOptions {
  scrollThreshold?: number;
}

export function useScrollVisibility(options?: UseScrollVisibilityOptions) {
  const { scrollThreshold = 100 } = options || {};

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if element should be visible based on scroll direction and threshold
      if (currentScrollY < lastScrollY || currentScrollY < scrollThreshold) {
        // Scrolling up or near top - show element
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY > scrollThreshold
      ) {
        // Scrolling down and past threshold - hide element
        setIsVisible(false);
      }

      setIsScrolled(currentScrollY > 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, scrollThreshold]);

  return { isScrolled, isVisible };
}

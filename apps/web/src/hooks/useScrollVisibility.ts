import { useEffect, useRef, useState } from "react";

interface UseScrollVisibilityOptions {
  // Always show near the top of the page
  scrollThreshold?: number;
  // Cooldown after the Foxy Sidecart closes to ignore programmatic scroll
  sidecartCooldownMs?: number;
}

export interface UseScrollVisibilityResult {
  isScrolled: boolean;
  isVisible: boolean;
  suppressTransitions: boolean;
}

// Restores straightforward direction-based visibility with a Sidecart guard so
// we avoid flicker when Foxy restores the scroll position.
export function useScrollVisibility(
  options?: UseScrollVisibilityOptions,
): UseScrollVisibilityResult {
  const { scrollThreshold = 100, sidecartCooldownMs = 250 } = options || {};

  const lastScrollYRef = useRef(0);
  const isVisibleRef = useRef(true);
  const tickingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const sidecartActiveRef = useRef(false);
  const sidecartCooldownUntilRef = useRef(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Initialize suppressTransitions state based on current conditions
  const initialSuppressTransitions =
    sidecartActiveRef.current ||
    (typeof performance !== "undefined" &&
      performance.now() < sidecartCooldownUntilRef.current);

  const [suppressTransitions, setSuppressTransitions] = useState(
    initialSuppressTransitions,
  );

  useEffect(() => {
    const getNow = () => {
      try {
        return performance.now();
      } catch {
        return Date.now();
      }
    };

    const syncBaseline = () => {
      try {
        lastScrollYRef.current = window.scrollY || 0;
      } catch {
        lastScrollYRef.current = 0;
      }
    };

    const setVisibility = (next: boolean) => {
      if (isVisibleRef.current === next) return;
      isVisibleRef.current = next;
      setIsVisible(next);
    };

    const isSidecartActive = () => {
      try {
        const body = document.body;
        if (!body) return false;
        if (body.classList.contains("cart-visible")) return true;
        return Boolean(document.querySelector("[data-fc-store-page]"));
      } catch {
        return false;
      }
    };

    syncBaseline();
    setIsScrolled(lastScrollYRef.current > 0);

    const evaluate = () => {
      const currentY = Math.max(0, window.scrollY || 0);
      setIsScrolled(currentY > 0);

      if (sidecartActiveRef.current) {
        lastScrollYRef.current = currentY;
        return;
      }

      if (getNow() < sidecartCooldownUntilRef.current) {
        lastScrollYRef.current = currentY;
        return;
      }

      if (currentY <= scrollThreshold) {
        setVisibility(true);
        lastScrollYRef.current = currentY;
        return;
      }

      if (currentY > lastScrollYRef.current && currentY > scrollThreshold) {
        setVisibility(false);
      } else if (currentY < lastScrollYRef.current) {
        setVisibility(true);
      }

      lastScrollYRef.current = currentY;
    };

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      rafIdRef.current = window.requestAnimationFrame(() => {
        tickingRef.current = false;
        evaluate();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    evaluate();

    const observer = new MutationObserver(() => {
      const active = isSidecartActive();
      const changed = active !== sidecartActiveRef.current;
      sidecartActiveRef.current = active;

      if (changed && active) {
        syncBaseline();
        setSuppressTransitions(true);
      } else if (changed && !active) {
        sidecartCooldownUntilRef.current = getNow() + sidecartCooldownMs;
        syncBaseline();
        setSuppressTransitions(true);

        // Set up cooldown timer to turn off suppressTransitions after delay
        if (cooldownTimerRef.current) {
          clearTimeout(cooldownTimerRef.current);
        }
        cooldownTimerRef.current = setTimeout(() => {
          setSuppressTransitions(false);
        }, sidecartCooldownMs);
      }
    });

    try {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"],
      });
      // Secondary observer for sidecart mount/unmount without scanning entire document
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch {
      observer.disconnect();
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafIdRef.current != null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
      observer.disconnect();
    };
  }, [scrollThreshold, sidecartCooldownMs]);

  return { isScrolled, isVisible, suppressTransitions };
}

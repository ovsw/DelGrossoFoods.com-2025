"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

interface UseTimelineMarkerOptions {
  threshold?: number; // When to trigger the filled state (default: 0.5 for center)
}

interface UseTimelineMarkerResult {
  isFilled: boolean;
  hasPassed: boolean;
  elementRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook that tracks when a timeline marker should be filled based on scroll position.
 * The marker becomes filled when the element scrolls past the center of the viewport.
 */
export function useTimelineMarker(
  options?: UseTimelineMarkerOptions & {
    elementRef?: React.RefObject<HTMLDivElement>;
  },
): UseTimelineMarkerResult {
  const { threshold = 0.5, elementRef } = options || {};
  const internalRef = useRef<HTMLDivElement>(null);
  const [isFilled, setIsFilled] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  // Use provided ref or internal ref
  const elementRefToUse = elementRef || internalRef;

  useEffect(() => {
    const element = elementRefToUse.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementTop = entry.boundingClientRect.top;
          const elementHeight = entry.boundingClientRect.height;
          const windowHeight = window.innerHeight;

          // Calculate the center point of the element relative to viewport
          const elementCenter = elementTop + elementHeight / 2;
          const viewportCenter = windowHeight / 2;

          // Check if element center has passed the viewport center
          const shouldBeFilled = elementCenter <= viewportCenter;

          setIsFilled(shouldBeFilled);
          setHasPassed(elementTop + elementHeight < 0); // Element has completely passed viewport
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, elementRefToUse]);

  return {
    isFilled,
    hasPassed,
    elementRef: elementRefToUse,
  };
}

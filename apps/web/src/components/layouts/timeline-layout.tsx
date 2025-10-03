"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { SanityImage } from "@/components/elements/sanity-image";

interface TimelineEntry {
  title: string;
  subtitle?: string;
  content: React.ReactElement | null;
  image?: {
    id: string;
    alt?: string;
    hotspot?: { x: number; y: number } | null;
    crop?: { top: number; bottom: number; left: number; right: number } | null;
    preview?: string | null;
  } | null;
}

interface TimelineLayoutProps {
  data: TimelineEntry[];
}

const TomatoMarker = () => {
  const markerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: markerRef,
    offset: ["start end", "end 40%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={markerRef}
      className="size-12 sm:size-20 sm:flex sm:items-center sm:justify-center"
      style={{ scale }}
    >
      <img
        src="/images/tomato-image-small.png"
        alt="Timeline marker"
        className="h-10 w-10 md:h-12 md:w-12 object-contain"
      />
    </motion.div>
  );
};

export const TimelineLayout = ({ data }: TimelineLayoutProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const calculateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    // Calculate initial height
    calculateHeight();

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateHeight, 150); // 150ms debounce
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 50%", "end 80%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full mx-auto max-w-4xl md:px-10" ref={containerRef}>
      <div className="mb-16 text-center lg:mb-24"></div>
      <div ref={ref} className="relative max-w-7xl mx-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className={`marker_wrap ${index !== data.length - 1 ? "mb-20 md:mb-28" : ""}`}
          >
            <div className="marker_heading flex flex-row z-40 items-center top-40 self-start mb-3">
              <div className="flex-shrink-0 z-10">
                <TomatoMarker />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-brand-green">
                {item.title}
              </h3>
            </div>

            <div className="marker_content-wrap pl-14 sm:pl-24 md:pl-28">
              {item.subtitle && (
                <p className="text-xl md:text-2xl font-medium text-th-dark-700 mb-4">
                  {item.subtitle}
                </p>
              )}

              <div className="marker_rich-text prose prose-lg max-w-none mb-4">
                {item.content || null}
              </div>
              {item.image && (
                <div className="mt-8">
                  <SanityImage
                    image={{
                      id: item.image.id,
                      hotspot: item.image.hotspot || null,
                      crop: item.image.crop || null,
                      preview: item.image.preview || null,
                    }}
                    alt={item.image.alt || ""}
                    className="w-full max-w-md rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-5 sm:left-10 top-0 overflow-hidden w-[6px] -translate-x-1/2 bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-brand-green to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[6px] bg-gradient-to-t from-brand-green via-brand-green to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

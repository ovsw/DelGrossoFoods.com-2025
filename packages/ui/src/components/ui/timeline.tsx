"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  subtitle?: string;
  content: React.ReactElement | null;
  image?: {
    src?: string;
    alt?: string;
    id?: string;
    hotspot?: { x: number; y: number } | null;
    crop?: { top: number; bottom: number; left: number; right: number } | null;
    preview?: string | null;
    [key: string]: unknown;
  } | null;
}

interface TimelineProps {
  data: TimelineEntry[];
  renderImage?: (
    image: NonNullable<TimelineEntry["image"]>,
    className?: string,
  ) => React.ReactNode;
}

const TomatoMarker = () => {
  const markerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: markerRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={markerRef}
      className="h-16 w-16 md:h-20 md:w-20 rounded-full flex items-center justify-center"
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

export const Timeline = ({ data, renderImage }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full mx-auto max-w-7xl dark:bg-neutral-950 md:px-10"
      ref={containerRef}
    >
      <div className="mb-16 text-center lg:mb-24"></div>
      <div ref={ref} className="relative max-w-7xl mx-auto">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10  md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="flex-shrink-0">
                <TomatoMarker />
              </div>
              <div className="hidden md:block md:pl-20">
                <h3 className="text-xl md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-lg md:text-2xl font-medium text-neutral-400 dark:text-neutral-400 mt-2">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <div className="md:hidden">
                <h3 className="text-2xl mb-2 text-left font-bold text-neutral-500 dark:text-neutral-500">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-lg mb-4 text-left font-medium text-neutral-400 dark:text-neutral-400">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <div className="prose prose-lg max-w-none mb-8">
                {item.content || null}
              </div>
              {item.image && (
                <div className="mt-8">
                  {renderImage ? (
                    renderImage(
                      item.image,
                      "w-full max-w-md rounded-lg shadow-md",
                    )
                  ) : (
                    <img
                      src={item.image.src}
                      alt={item.image.alt}
                      className="w-full max-w-md rounded-lg shadow-md"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-10 top-0 overflow-hidden w-[6px] -translate-x-1/2 bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-brand-green to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
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

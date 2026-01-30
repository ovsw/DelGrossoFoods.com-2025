"use client";

import { Button } from "@workspace/ui/components/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { SlideshowHeroSectionShell } from "./slideshow-hero-section-shell";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  sauceImage: string[];
  sauceAlts: string[];
  buttonLink: string;
  buttonText: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "DelGrosso",
    subtitle: "Original Sauce",
    description:
      "Delicious, authentic sauces made since 1914 using quality ingredients by the DelGrosso Family – America's Oldest Family Sauce-maker.",
    sauceImage: ["/images/collages/DGF-original-collage.avif"],
    sauceAlts: [
      "DelGrosso Marinara, Pepperoni Flavored, and Garlic & Cheese pasta sauces",
    ],
    buttonLink: "/sauces/",
    buttonText: "Order Online",
  },
  {
    id: 2,
    title: "La Famiglia",
    subtitle: "DelGrosso",
    description:
      "This special line of organic pasta sauces is simple, delicious, and carries the family seal of approval. Buon Appetito!",
    sauceImage: ["/images/collages/LFD-collage.avif"],

    sauceAlts: ["DelGrosso Arrabbiata, Mushroom, and Traditional pasta sauces"],
    buttonLink: "/sauces/",
    buttonText: "Order Online",
  },

  {
    id: 3,
    title: "DelGrosso",
    subtitle: "Organic Sauces",
    description:
      "Experience the rich heritage of DelGrosso. Each jar captures the essence of a family recipe passed down through generations.",
    sauceImage: ["/images/collages/DGF-organic-collage.avif"],
    sauceAlts: [
      "DelGrosso Meat Sauce, Four Cheese, and Roasted Garlic pasta sauces",
    ],
    buttonLink: "/sauces/",
    buttonText: "Order Online",
  },
];

const SLIDE_DURATION = 6000; // milliseconds

export function HomeSlideshowSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const handleNextSlide = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 300); // Short delay for visual transition
  }, [isTransitioning]);

  const handlePrevSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300); // Short delay for visual transition
  };

  // Effect for auto-advancing slides
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [currentSlide, handleNextSlide]); // Depend on currentSlide to reset timer

  // Effect to trigger initial progress bar animation on mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSlideChange = (index: number) => {
    if (isTransitioning || index === currentSlide) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300); // Short delay for visual transition
  };

  const current = slides[currentSlide]!;
  const familyPhotoCard = (
    <div className="mb-6 w-full max-w-[17rem] -rotate-2 transform bg-white p-4 shadow-lg hover:rotate-0 md:mb-0 md:max-w-[19rem] lg:max-w-[18rem]">
      <Image
        priority={true}
        width={460}
        height={280}
        src="/images/delgrosso-family-photo.jpg"
        alt="DelGrosso family photo of gathering with traditional cooking"
        className="w-full object-cover"
      />
      <div className="font-handwriting mt-2 text-center text-sm text-gray-600">
        Family Tradition Since 1914
      </div>
    </div>
  );

  return (
    <SlideshowHeroSectionShell
      rootProps={{
        role: "region",
        "aria-label": "DelGrosso Sauce Lines Slideshow",
        "aria-live": "polite",
      }}
    >
      {/* Desktop Row 1: Text Content */}
      <div className="hidden w-full lg:mx-auto lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,1fr)_minmax(0,auto)] lg:items-start lg:gap-12 xl:max-w-6xl">
        {/* Left Column: Headline, Copy, and CTA */}
        <div className="space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h1 className="mb-3 text-xl font-bold md:text-2xl">
                {current.title}
              </h1>
              <h2 className="mb-6 text-3xl font-semibold md:text-4xl lg:text-5xl leading-snug">
                {current.subtitle}
              </h2>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${current.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <p className="text-base italic">{current.description}</p>
              <Button asChild size="lg">
                <Link href={current.buttonLink}>{current.buttonText}</Link>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Family Photo */}
        <div className="flex justify-end">{familyPhotoCard}</div>
      </div>

      {/* Desktop Row 2: Product Jars */}
      <div className="hidden w-full lg:flex lg:justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: "10%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "0%" }}
            transition={{ duration: 0.35 }}
            className="relative flex min-h-[32svh] w-auto flex-shrink-0 items-end justify-start lg:justify-center"
          >
            {current.sauceImage.map((image, index) => (
              <Image
                priority={true}
                key={`${current.id}-${index}`}
                src={image}
                alt={
                  current.sauceAlts[index] ??
                  `${current.title} ${current.subtitle}`
                }
                width={500}
                height={300}
                className="block min-h-[32svh] w-auto object-contain"
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Layout - Single Column */}
      <div className="flex w-full flex-col gap-12 lg:hidden">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-start md:justify-between">
          {/* Text Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="mb-3 text-2xl font-bold md:text-3xl">
                  {current.title}
                </h1>
                <h2 className="mb-8 text-3xl font-semibold md:text-5xl leading-tight">
                  {current.subtitle}
                </h2>
                <p className="mb-8 text-base italic">{current.description}</p>
                <Button asChild size="lg">
                  <Link href={current.buttonLink}>{current.buttonText}</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Family Photo */}
          <div className="hidden w-full max-w-[18rem] md:block md:flex-none">
            {familyPhotoCard}
          </div>
        </div>

        {/* Product Jars */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: "10%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "0%" }}
              transition={{ duration: 0.35 }}
              className="relative min-h-[35svh] w-auto items-end justify-center"
            >
              {current.sauceImage.map((image, index) => (
                <Image
                  priority={true}
                  key={`${current.id}-${index}`}
                  src={image}
                  alt={
                    current.sauceAlts[index] ??
                    `${current.title} ${current.subtitle}`
                  }
                  width={500}
                  height={300}
                  className="block min-h-[35svh] w-auto object-contain"
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform items-center space-x-4">
        <button
          onClick={handlePrevSlide}
          disabled={isTransitioning}
          className="rounded-full bg-white/80 p-2 transition-colors hover:bg-white disabled:opacity-50"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Slide Indicators */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              disabled={isTransitioning}
              className={`h-3 w-3 rounded-full transition-colors ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNextSlide}
          disabled={isTransitioning}
          className="rounded-full bg-white/80 p-2 transition-colors hover:bg-white disabled:opacity-50"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-2 w-full bg-white/30">
        <div
          key={`${currentSlide}-${hasMounted}`}
          className="bg-brand-green h-full animate-[progress-animation_6000ms_linear]"
        />
      </div>

      <style>{`
        @keyframes progress-animation {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </SlideshowHeroSectionShell>
  );
}

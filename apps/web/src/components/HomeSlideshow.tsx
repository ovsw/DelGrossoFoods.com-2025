"use client";

import { Button } from "@workspace/ui/components/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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
    buttonLink: "/sauce/",
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
    buttonLink: "/sauce/",
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
    buttonLink: "/sauce/",
    buttonText: "Order Online",
  },
];

const SLIDE_DURATION = 6000; // milliseconds

export function HomeSlideshow() {
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

  return (
    <div
      className="relative w-full justify-center overflow-hidden bg-[url('/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600.jpg')] bg-cover bg-bottom pt-36 pb-16"
      role="region"
      aria-label="DelGrosso Sauce Lines Slideshow"
      aria-live="polite"
    >
      {/* Centered Container (Yellow) */}
      <div className="mx-auto flex max-w-7xl transform flex-col items-center justify-center gap-8 px-4 sm:px-8 lg:translate-x-20 lg:flex-row lg:items-stretch lg:justify-start lg:px-16">
        {/* Mobile-only Slideshow Image (Green, at the top) */}
        {/* <div className="order-1 w-full lg:hidden">
          {renderSauceImages('mx-auto')}
        </div> */}

        {/* Left Static Content Polaroid Image*/}
        {/* <div className="flex max-w-md items-center pt-20 lg:hidden lg:max-w-sm lg:pt-0">
          <div className="-rotate-2 transform bg-white p-4 shadow-lg transition-transform duration-300 hover:rotate-0">
            <img
              src="/images/delgrosso-family-photo.jpg"
              alt="DelGrosso family photo of gathering with traditional cooking"
              className="w-full object-cover"
            />
            <div className="font-handwriting mt-2 text-center text-sm text-gray-600">
              Family Tradition Since 1914
            </div>
          </div>
        </div> */}

        <div className="container mx-auto flex w-full items-start gap-6 lg:flex-row lg:justify-start lg:gap-8">
          <div
            className={`w-[15rem] py-4 md:min-w-[20rem] lg:order-1 lg:w-md lg:py-0`}
          >
            <div className="mb-8 max-w-[20rem] -rotate-2 transform bg-white p-2 shadow-lg hover:rotate-0 md:p-4">
              <Image
                priority={true}
                width={500}
                height={300}
                src="/images/delgrosso-family-photo.jpg"
                alt="DelGrosso family photo of gathering with traditional cooking"
                className="w-full object-cover"
              />
              <div className="font-handwriting mt-2 hidden text-center text-sm text-gray-600 md:block">
                Family Tradition Since 1914
              </div>
            </div>
            {/* Left Slideshow Content (Purple - Text) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id} // Use the same key as the image container
                initial={{ opacity: 0 }} // Start hidden
                animate={{ opacity: 1 }} // Animate to fully visible
                exit={{ opacity: 0 }} // Animate to hidden
                transition={{ duration: 0.35 }} // Match image animation duration
              >
                <h1 className="mb-2 text-xl font-bold">{current.title}</h1>
                <h2 className="mb-6 text-2xl font-semibold md:text-4xl lg:text-4xl">
                  {current.subtitle}
                </h2>
                <p className="mb-8 text-base italic">{current.description}</p>
                <Button asChild size="lg">
                  <Link href={current.buttonLink}>{current.buttonText}</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slideshow Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id} // Key changes with the slide to trigger exit/enter animations
              initial={{ opacity: 0, x: "10%" }} // Start off-screen right and hidden
              animate={{ opacity: 1, x: "0%" }} // Animate to fully visible at final position
              exit={{ opacity: 0, x: "0%" }} // Animate to hidden in place (fade out only)
              transition={{ duration: 0.35 }} // Animation duration
              className={`relative order-2 min-h-[60svh] w-auto flex-shrink-0 items-start justify-start lg:flex lg:flex-col`}
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
                  width={500} // Aspect ratio hint
                  height={300} // Aspect ratio hint
                  className={`block min-h-[60svh] w-auto object-contain`}
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
    </div>
  );
}

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

  return (
    <div
      className="relative w-full justify-center overflow-hidden bg-[url('/images/bg/counter-wall-5-no-bottom-border-ultrawide-p-2600.jpg')] bg-cover bg-bottom pt-36 pb-16"
      role="region"
      aria-label="DelGrosso Sauce Lines Slideshow"
      aria-live="polite"
    >
      {/* Centered Container (Yellow) */}
      <div className="mx-auto flex max-w-7xl transform flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch lg:justify-start ">
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

        <div className="container mx-auto flex w-full flex-col items-center justify-end gap-12 px-6 text-center md:text-left lg:grid lg:grid-cols-[minmax(24rem,44%)_minmax(0,1fr)] lg:items-end lg:gap-0 lg:max-w-5xl">
          <div className="flex w-full max-w-[20rem] flex-col items-center justify-end gap-8 py-6 md:max-w-none md:grid md:grid-cols-[minmax(0,auto)_minmax(0,1fr)] md:gap-10 md:py-8 lg:order-1 lg:max-w-[26rem] lg:grid-cols-1 lg:justify-items-center lg:gap-10 lg:py-10">
            <div className="mb-4 w-full max-w-[18rem] -rotate-2 transform bg-white p-2 shadow-lg hover:rotate-0 md:mb-0 md:max-w-[20rem] md:justify-self-start md:me-8 md:p-4 lg:me-0 lg:justify-self-center">
              <Image
                priority={true}
                width={500}
                height={300}
                src="/images/delgrosso-family-photo.jpg"
                alt="DelGrosso family photo of gathering with traditional cooking"
                className="w-full object-cover"
              />
            </div>
            {/* Left Slideshow Content (Purple - Text) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id} // Use the same key as the image container
                initial={{ opacity: 0 }} // Start hidden
                animate={{ opacity: 1 }} // Animate to fully visible
                exit={{ opacity: 0 }} // Animate to hidden
                transition={{ duration: 0.35 }} // Match image animation duration
                className="flex w-full flex-col items-center text-center md:items-start md:text-left lg:items-center lg:text-center"
              >
                {/* <h1 className="mb-2 text-xl font-bold">{current.title}</h1> */}
                <h2 className="mb-6 text-2xl font-semibold md:text-4xl lg:text-4xl">
                  {current.subtitle}
                </h2>
                <p className="mb-8 text-base italic">{current.description}</p>
                <Button
                  asChild
                  size="lg"
                  className="md:self-start lg:self-center"
                >
                  <Link href={current.buttonLink}>{current.buttonText}</Link>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slideshow Image */}
          <div className="relative order-2 flex w-full flex-col items-center justify-end pl-2 md:pl-6 lg:order-2 lg:self-stretch lg:items-end lg:justify-center lg:pl-16">
            <div className="relative w-full overflow-visible lg:h-full lg:self-stretch">
              <div className="relative flex w-full items-end justify-center lg:absolute lg:-bottom-4 lg:left-0 lg:h-[calc(100%-1.25rem)] lg:w-[125%] lg:max-w-[720px] lg:-translate-x-4 lg:[aspect-ratio:4/3] lg:items-end lg:justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id} // Key changes with the slide to trigger exit/enter animations
                    initial={{ opacity: 0, x: "10%" }} // Start off-screen right and hidden
                    animate={{ opacity: 1, x: "0%" }} // Animate to fully visible at final position
                    exit={{ opacity: 0, x: "0%" }} // Animate to hidden in place (fade out only)
                    transition={{ duration: 0.35 }} // Animation duration
                    className="flex h-full w-full items-end justify-center lg:justify-start"
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
                        className="block h-full max-h-[28rem] w-auto object-contain lg:h-full lg:max-h-none"
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
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

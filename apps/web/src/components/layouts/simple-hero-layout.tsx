import { Section } from "@workspace/ui/components/section";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

export interface SimpleHeroLayoutProps {
  readonly src: string;
  readonly alt: string;
  readonly width?: number;
  readonly height?: number;
  readonly objectFit?: "cover" | "contain";
  readonly priority?: boolean;
  readonly className?: string;
  readonly sizes?: string;
  readonly quality?: number;
  readonly placeholder?: "blur" | "empty";
  readonly blurDataURL?: string;
}

export function SimpleHeroLayout({
  src,
  alt,
  width = 1200,
  height = 800,
  objectFit = "contain",
  priority = false,
  className,
  sizes,
  quality,
  placeholder,
  blurDataURL,
}: SimpleHeroLayoutProps) {
  return (
    <Section
      spacingTop="page-top"
      spacingBottom="default"
      className={cn("relative isolate overflow-hidden", className)}
    >
      <div className="container relative mx-auto max-w-6xl px-4 md:px-0 lg:pt-20">
        <div className={cn("image_wrapper flex items-center justify-center")}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
            sizes={sizes}
            quality={quality}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            className={cn(
              "w-full",
              objectFit === "cover" ? "object-cover" : "object-contain",
            )}
          />
        </div>
      </div>
    </Section>
  );
}

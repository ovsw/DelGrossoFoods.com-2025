import { SimpleHeroLayout } from "@/components/layouts/simple-hero-layout";

export function WhereToBuyHeroSection() {
  return (
    <SimpleHeroLayout
      src="/images/lfd-where-to-buy-map.avif"
      alt="Map showing La Famiglia DelGrosso sauce availability across the United States"
      width={1200}
      height={800}
      objectFit="contain"
      priority
    />
  );
}

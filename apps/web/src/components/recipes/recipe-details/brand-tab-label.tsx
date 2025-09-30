import Image from "next/image";

import LogoSvg from "@/components/elements/logo";

type VariantKey = "original" | "premium";

export function BrandTabLabel({ variant }: { variant: VariantKey }) {
  if (variant === "premium") {
    return (
      <span
        className="inline-flex flex-col items-start gap-1 text-start leading-tight"
        data-html="c-brand-tab-label"
      >
        <span
          className="relative block h-6 w-full overflow-hidden"
          data-html="c-brand-tab-logo"
        >
          <Image
            src="/images/logos/lfd-logo-light-short-p-500.png"
            alt=""
            fill
            sizes="140px"
            className="object-contain object-left"
            priority={false}
          />
        </span>
        <span aria-hidden className="text-sm" data-html="c-brand-tab-text">
          La Famiglia DelGrosso
        </span>
      </span>
    );
  }
  return (
    <span
      className="inline-flex flex-col items-start gap-1 text-start leading-tight"
      data-html="c-brand-tab-label"
    >
      <LogoSvg
        className="h-6 w-auto self-start"
        aria-hidden
        data-html="c-brand-tab-logo"
      />
      <span aria-hidden className="text-sm" data-html="c-brand-tab-text">
        DelGrosso Original
      </span>
    </span>
  );
}

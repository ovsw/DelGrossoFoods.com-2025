/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import type { ImageResponseOptions } from "next/server";

import LogoSvg from "@/components/elements/logo";
import type { Maybe } from "@/types";
import { getTitleCase } from "@/utils";

import { getOgMetaData } from "./og-config";
import {
  getGenericPageOGData,
  getHomePageOGData,
  getSlugPageOGData,
} from "./og-data";

export const runtime = "edge";

const OG_CACHE_CONTROL =
  "public, s-maxage=86400, stale-while-revalidate=604800";
const DGF_OG_BRAND_BACKGROUND = "#004e42";
const PACKSHOT_CONTENT_TYPES = new Set(["product", "sauce"]);
const libreBaskervilleRegularUrl = new URL(
  "./fonts/libre-baskerville-latin-400-normal.woff",
  import.meta.url,
);
const libreBaskervilleBoldUrl = new URL(
  "./fonts/libre-baskerville-latin-700-normal.woff",
  import.meta.url,
);

const errorContent = (
  <div tw="flex flex-col w-full h-full items-center justify-center">
    <div tw=" flex w-full h-full items-center justify-center ">
      <h1 tw="text-white">Something went Wrong with image generation</h1>
    </div>
  </div>
);

type SeoImageRenderProps = {
  seoImage: string;
};

type ContentProps = Record<string, string>;

type OgContentRenderInput = {
  image?: Maybe<string>;
  title?: Maybe<string>;
  dominantColor?: Maybe<string>;
  _type?: Maybe<string>;
  description?: Maybe<string>;
};

type OgContentData = OgContentRenderInput & {
  seoImage?: Maybe<string>;
};

type NormalizedOgContentData = {
  title: string;
  description: string | null;
  contentType: string | null;
  image: string | null;
  seoImage: string | null;
  dominantColor: string;
};

const seoImageRender = ({ seoImage }: SeoImageRenderProps) => {
  return (
    <div tw="flex flex-col w-full h-full items-center justify-center">
      <img src={seoImage} alt="SEO preview" width={1200} height={630} />
    </div>
  );
};

const cleanString = (value?: Maybe<string>): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

const normalizeOgContentData = (
  input: OgContentData,
): NormalizedOgContentData => {
  const labelSource = cleanString(input._type);

  return {
    title: cleanString(input.title) ?? "DelGrosso Foods",
    description: cleanString(input.description),
    contentType: labelSource,
    image: cleanString(input.image),
    seoImage: cleanString(input.seoImage),
    dominantColor: cleanString(input.dominantColor) ?? "#12061F",
  };
};

const isPackshotContentType = (contentType: string | null): boolean =>
  contentType !== null && PACKSHOT_CONTENT_TYPES.has(contentType);

const packshotContentRender = ({
  image,
  title,
  description,
}: NormalizedOgContentData) => {
  return (
    <div
      tw="flex flex-row overflow-hidden relative w-full h-full"
      style={{
        fontFamily: "Libre Baskerville",
        backgroundColor: DGF_OG_BRAND_BACKGROUND,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="packshot-gradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "rgba(18,6,31,0.18)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255,255,255,0.12)" }}
            />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#packshot-gradient)" />
      </svg>

      <div
        tw="flex-1 p-10 flex flex-col justify-between relative"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          tw="flex justify-between items-start w-full"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div tw="flex items-center" style={{ gap: 16 }}>
            <LogoSvg style={{ width: 160, height: 32, color: "#ffffff" }} />
          </div>
        </div>

        <div tw="flex flex-col" style={{ gap: 20, maxWidth: "92%" }}>
          <h1 tw="text-5xl font-bold leading-tight text-white">{title}</h1>
          {description && <p tw="text-lg text-white">{description}</p>}
        </div>
      </div>

      <div
        tw="flex items-center justify-center p-8 relative"
        style={{ width: 630, height: 630 }}
      >
        <div
          tw="flex items-center justify-center"
          style={{
            width: 566,
            height: 566,
            padding: 16,
          }}
        >
          <img
            src={image ?? ""}
            width={566}
            height={566}
            alt="Content preview"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const contentImageRender = ({
  image,
  title,
  dominantColor,
  description,
}: NormalizedOgContentData) => {
  return (
    <div
      tw="flex flex-row overflow-hidden relative w-full"
      style={{
        fontFamily: "Libre Baskerville",
        backgroundColor: dominantColor,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "rgba(18,6,31,0.2)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255,255,255,0.18)" }}
            />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)" />
      </svg>

      <div
        tw="flex-1 p-10 flex flex-col justify-between relative"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          tw="flex justify-between items-start w-full"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div tw="flex items-center" style={{ gap: 16 }}>
            {/* Inline SVG logo; Tailwind classes not applied in OG, so rely on style */}
            <LogoSvg style={{ width: 160, height: 32, color: "#ffffff" }} />
          </div>
        </div>

        <h1
          tw="text-5xl font-bold leading-tight text-white"
          style={{ maxWidth: "90%" }}
        >
          {title}
        </h1>
        {description && <p tw="text-lg text-white">{description}</p>}
      </div>

      <div
        tw="flex items-center justify-center p-8 relative"
        style={{ width: 630, height: 630 }}
      >
        <div
          tw="flex flex-col justify-center items-center overflow-hidden"
          style={{
            width: 566,
            height: 566,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: 24,
            boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
          }}
        >
          <img
            src={image ?? ""}
            width={566}
            height={566}
            alt="Content preview"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
};

const brandFallbackRender = ({
  title,
  dominantColor,
  description,
}: NormalizedOgContentData) => {
  return (
    <div
      tw="flex flex-row overflow-hidden relative w-full h-full"
      style={{
        fontFamily: "Libre Baskerville",
        backgroundColor: dominantColor,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="brand-fallback-gradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" style={{ stopColor: "rgba(18,6,31,0.28)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255,255,255,0.14)" }}
            />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#brand-fallback-gradient)" />
      </svg>

      <div
        tw="flex-1 p-10 flex flex-col justify-between relative"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div
          tw="flex justify-between items-start w-full"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <LogoSvg style={{ width: 160, height: 32, color: "#ffffff" }} />
        </div>

        <div tw="flex flex-col" style={{ gap: 20, maxWidth: "92%" }}>
          <h1 tw="text-5xl font-bold leading-tight text-white">{title}</h1>
          {description && <p tw="text-lg text-white">{description}</p>}
        </div>
      </div>

      <div
        tw="flex items-center justify-center p-8 relative"
        style={{ width: 630, height: 630 }}
      >
        <div
          tw="flex flex-col items-center justify-between"
          style={{
            width: 566,
            height: 566,
            padding: 44,
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.14)",
            boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
          }}
        >
          <div
            tw="flex items-center justify-center"
            style={{
              width: "100%",
              flex: 1,
            }}
          >
            <LogoSvg style={{ width: 260, height: 260, color: "#ffffff" }} />
          </div>
          <div
            tw="flex"
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 28,
              lineHeight: 1.2,
            }}
          >
            Since 1947
          </div>
        </div>
      </div>
    </div>
  );
};

const libreBaskervilleRegularPromise = fetch(libreBaskervilleRegularUrl).then(
  (res) => res.arrayBuffer(),
);
const libreBaskervilleBoldPromise = fetch(libreBaskervilleBoldUrl).then((res) =>
  res.arrayBuffer(),
);

const getOptions = async ({
  width,
  height,
}: {
  width: number;
  height: number;
}): Promise<ImageResponseOptions> => {
  const [libreBaskervilleRegular, libreBaskervilleBold] = await Promise.all([
    libreBaskervilleRegularPromise,
    libreBaskervilleBoldPromise,
  ]);
  return {
    width,
    height,
    fonts: [
      {
        name: "Libre Baskerville",
        data: libreBaskervilleRegular,
        style: "normal",
        weight: 400,
      },
      {
        name: "Libre Baskerville",
        data: libreBaskervilleBold,
        style: "normal",
        weight: 700,
      },
    ],
  };
};

const renderOgContent = (data: OgContentData) => {
  const normalized = normalizeOgContentData(data);

  if (normalized.seoImage) {
    return seoImageRender({ seoImage: normalized.seoImage });
  }

  if (normalized.image && isPackshotContentType(normalized.contentType)) {
    return packshotContentRender(normalized);
  }

  if (normalized.image) {
    return contentImageRender(normalized);
  }

  return brandFallbackRender(normalized);
};

const getHomePageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const [result, err] = (await getHomePageOGData(id)) as [
    OgContentData | undefined,
    unknown,
  ];
  if (err || !result) return undefined;
  return renderOgContent(result);
};
const getSlugPageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const [result, err] = (await getSlugPageOGData(id)) as [
    OgContentData | undefined,
    unknown,
  ];
  if (err || !result) return undefined;
  return renderOgContent(result);
};

const getGenericPageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const [result, err] = (await getGenericPageOGData(id)) as [
    OgContentData | undefined,
    unknown,
  ];
  if (err || !result) return undefined;
  return renderOgContent(result);
};

const block = {
  homePage: getHomePageContent,
  page: getSlugPageContent,
} as const;

export async function GET({ url }: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(url);
  const type = searchParams.get("type") as keyof typeof block;
  const { width, height } = getOgMetaData(searchParams);
  const para = Object.fromEntries(searchParams.entries());
  const options = await getOptions({ width, height });
  const image = block[type] ?? getGenericPageContent;
  try {
    const content = await image(para);
    const response = new ImageResponse(
      content ? content : errorContent,
      options,
    );
    response.headers.set("Cache-Control", OG_CACHE_CONTROL);
    return response;
  } catch (err) {
    console.log({ err });
    const response = new ImageResponse(errorContent, options);
    response.headers.set("Cache-Control", OG_CACHE_CONTROL);
    return response;
  }
}

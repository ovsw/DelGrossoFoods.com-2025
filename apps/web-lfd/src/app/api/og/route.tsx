/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import type { ImageResponseOptions } from "next/server";

import LogoSvg from "@/components/elements/logo";
import type { Maybe } from "@/types";

import { getOgMetaData } from "./og-config";
import {
  getGenericPageOGData,
  getHomePageOGData,
  getSlugPageOGData,
} from "./og-data";

export const runtime = "edge";
const LFD_OG_BRAND_BACKGROUND = "#000000";
const PACKSHOT_CONTENT_TYPES = new Set(["product", "sauce"]);

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
  image: string | null;
  title: string;
  dominantColor: string;
  description: string | null;
  contentType: string | null;
  seoImage: string | null;
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
  const contentType = cleanString(input._type);

  return {
    image: cleanString(input.image),
    title: cleanString(input.title) ?? "La Famiglia DelGrosso Sauces",
    dominantColor: cleanString(input.dominantColor) ?? "#12061F",
    description: cleanString(input.description),
    contentType,
    seoImage: cleanString(input.seoImage),
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
        fontFamily: "Inter",
        backgroundColor: LFD_OG_BRAND_BACKGROUND,
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
            <stop offset="0%" style={{ stopColor: "rgba(255,255,255,0.06)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "rgba(255,255,255,0.14)" }}
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

const dominantColorSeoImageRender = ({
  image,
  title,
  dominantColor,
  description,
}: NormalizedOgContentData) => {
  return (
    <div
      tw="flex flex-row overflow-hidden relative w-full"
      style={{
        fontFamily: "Inter",
        backgroundColor: dominantColor ?? "#12061F",
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
            <stop offset="0%" style={{ stopColor: "transparent" }} />
            <stop offset="100%" style={{ stopColor: "white" }} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)" opacity="0.2" />
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
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05), 0 2px 4px -1px rgba(0,0,0,0.03), 0 4px 6px -1px rgba(0,0,0,0.05), 0 8px 10px -1px rgba(0,0,0,0.05)",
          }}
        >
          <div tw="flex relative w-full h-full">
            {image ? (
              <img
                src={image}
                width={566}
                height={566}
                alt="Content preview"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 24,
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div tw="flex items-center justify-center h-full w-full">
                <img
                  src={"https://picsum.photos/566/566"}
                  alt="Logo"
                  width={400}
                  height={400}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

async function getTtfFont(
  family: string,
  axes: string[],
  value: number[],
): Promise<ArrayBuffer> {
  const familyParam = `${axes.join(",")}@${value.join(",")}`;

  // Get css style sheet with user agent Mozilla/5.0 Firefox/1.0 to ensure non-variable TTF is returned
  const cssCall = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:${familyParam}&display=swap`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 Firefox/1.0",
      },
    },
  );

  const css = await cssCall.text();
  const ttfUrl = css.match(/url\(([^)]+)\)/)?.[1];

  if (!ttfUrl) {
    throw new Error("Failed to extract font URL from CSS");
  }

  return await fetch(ttfUrl).then((res) => res.arrayBuffer());
}

const getOptions = async ({
  width,
  height,
}: {
  width: number;
  height: number;
}): Promise<ImageResponseOptions> => {
  const [interRegular, interBold, interSemiBold] = await Promise.all([
    getTtfFont("Inter", ["wght"], [400]),
    getTtfFont("Inter", ["wght"], [700]),
    getTtfFont("Inter", ["wght"], [600]),
  ]);
  return {
    width,
    height,
    fonts: [
      {
        name: "Inter",
        data: interRegular,
        style: "normal",
        weight: 400,
      },
      {
        name: "Inter",
        data: interBold,
        style: "normal",
        weight: 700,
      },
      {
        name: "Inter",
        data: interSemiBold,
        style: "normal",
        weight: 600,
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

  return dominantColorSeoImageRender(normalized);
};

const getHomePageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const [result, err] = await getHomePageOGData(id);
  if (err || !result) return undefined;
  return renderOgContent(result);
};
const getSlugPageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const [result, err] = await getSlugPageOGData(id);
  if (err || !result) return undefined;
  return renderOgContent(result);
};

const getGenericPageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const [result, err] = await getGenericPageOGData(id);
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
    return new ImageResponse(content ? content : errorContent, options);
  } catch (err) {
    console.log({ err });
    return new ImageResponse(errorContent, options);
  }
}

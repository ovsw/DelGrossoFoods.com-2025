import { ImageResponse } from "next/og";

import LogoSvg from "@/components/elements/Logo";

export const runtime = "edge";

// Helpers: numeric parsing and color validation
function parseIntClamped(
  value: string | null,
  defaultValue: number,
  min: number,
  max: number,
): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return defaultValue;
  const intVal = Math.round(num);
  return Math.max(min, Math.min(max, intVal));
}

const NAMED_COLORS = new Set([
  "black",
  "white",
  "red",
  "green",
  "blue",
  "gray",
  "grey",
  "orange",
  "purple",
  "yellow",
  "cyan",
  "magenta",
  "teal",
  "navy",
  "maroon",
  "olive",
  "silver",
]);

function isValidHexColor(input: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input);
}

function isValidRgb(input: string): boolean {
  const match = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/.exec(
    input,
  );
  if (!match) return false;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

function isValidRgba(input: string): boolean {
  const match =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/.exec(
      input,
    );
  if (!match) return false;
  const r = Number(match[1]);
  const g = Number(match[2]);
  const b = Number(match[3]);
  const a = Number(match[4]);
  const rgbOk = r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  return rgbOk && a >= 0 && a <= 1;
}

function validateColor(
  input: string | null,
  options: { allowTransparent: boolean },
  defaultValue: string,
): string {
  if (!input) return defaultValue;
  const value = input.trim();
  if (options.allowTransparent && value.toLowerCase() === "transparent") {
    return "rgba(0,0,0,0)";
  }
  if (
    isValidHexColor(value) ||
    isValidRgb(value) ||
    isValidRgba(value) ||
    NAMED_COLORS.has(value.toLowerCase())
  ) {
    return value;
  }
  return defaultValue;
}

// /api/logo?w=400&h=120&color=%23ffffff&bg=transparent
export async function GET(request: Request): Promise<ImageResponse | Response> {
  try {
    const { searchParams } = new URL(request.url);
    const width = parseIntClamped(searchParams.get("w"), 400, 1, 1600);
    const height = parseIntClamped(searchParams.get("h"), 120, 1, 800);
    const color = validateColor(
      searchParams.get("color"),
      { allowTransparent: false },
      "#000000",
    );
    const backgroundColor = validateColor(
      searchParams.get("bg"),
      { allowTransparent: true },
      "rgba(0,0,0,0)",
    );

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor,
            color,
          }}
        >
          <LogoSvg style={{ width, height }} />
        </div>
      ),
      {
        width,
        height,
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("/api/logo error:", message);
    return new Response(`Logo render error: ${message}`, { status: 500 });
  }
}

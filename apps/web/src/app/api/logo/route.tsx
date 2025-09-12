import { ImageResponse } from "next/og";

import LogoSvg from "@/components/elements/Logo";

export const runtime = "edge";

// /api/logo?w=400&h=120&color=%23ffffff&bg=transparent
export async function GET(request: Request): Promise<ImageResponse | Response> {
  try {
    const { searchParams } = new URL(request.url);
    const width = Math.max(1, Number(searchParams.get("w") ?? 400));
    const height = Math.max(1, Number(searchParams.get("h") ?? 120));
    const color = searchParams.get("color") ?? "#000000";
    const bg = searchParams.get("bg") ?? "transparent";

    const backgroundColor = bg === "transparent" ? "rgba(0,0,0,0)" : bg;

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

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { normalizeSiteId, SITE_ID_COOKIE_NAME } from "@/lib/site/constants";

export function middleware(request: NextRequest) {
  const siteId = normalizeSiteId(request.nextUrl.searchParams.get("siteId"));

  if (!siteId) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-dgf-site-id", siteId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.cookies.set({
    name: SITE_ID_COOKIE_NAME,
    value: siteId,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/|static/|favicon.ico).*)"],
};

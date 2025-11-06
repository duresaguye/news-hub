import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protect selected routes by checking the presence of the Better Auth session cookie
const PROTECTED_PREFIXES = [
  "/profile",
  "/saved-articles",
  "/subscription",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get("news_hub_session"));
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/saved-articles/:path*",
    "/subscription/:path*",
  ],
};



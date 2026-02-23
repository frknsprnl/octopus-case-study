import { NextRequest, NextResponse } from "next/server";

const PROTECTED = /^\/products(\/.*)?$/;
const AUTH_ONLY = /^\/login$/;
const STORAGE_KEY = "user";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read session from cookies (set by the client via document.cookie for SSR awareness)
  // Falls back to checking the cookie that next-auth or our custom code may set.
  // Since we store tokens in localStorage/sessionStorage (client-only), we use a
  // lightweight cookie as a presence signal written on login and cleared on logout.
  const hasSession = request.cookies.has(STORAGE_KEY);

  if (PROTECTED.test(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ONLY.test(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/products", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/login"]
};

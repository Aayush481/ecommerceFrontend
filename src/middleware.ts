import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal next paths, api requests, public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname) ||
    pathname === '/favicon.ico'
  ) {
    return;
  }

  // Check if the locale prefix is already present
  const pathnameHasLocale = pathname.startsWith('/it/') || pathname === '/it' || pathname.startsWith('/en/') || pathname === '/en';

  if (pathnameHasLocale) {
    return;
  }

  // Redirect to default locale: Italian ('it')
  request.nextUrl.pathname = `/it${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and public assets
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

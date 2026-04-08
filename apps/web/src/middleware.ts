import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;
  const protectedPrefixes = ['/dashboard', '/cart', '/wishlist', '/orders'];
  const isProtectedRoute = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Keep auth pages reachable so stale cookies don't trap users away from login.
  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.next();
  }

  // Only gate private routes behind authentication.
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.css|.*\\.js|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.woff|.*\\.woff2).*)',
  ],
};

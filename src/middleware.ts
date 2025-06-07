import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If accessing notice page, redirect to home page
  if (request.nextUrl.pathname === '/notice') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow all other routes
  return NextResponse.next();
}

export const config = {
  // Match all routes except static files
  matcher: ['/((?!_next/|favicon.ico).*)'],
};
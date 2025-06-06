import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow access to the notice page and static assets
  if (
    request.nextUrl.pathname === '/notice' ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Return 503 Service Unavailable for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse(JSON.stringify({ error: 'Service temporarily unavailable' }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Redirect all other routes to the notice page
  return NextResponse.redirect(new URL('/notice', request.url));
}

export const config = {
  // Match all routes except static files
  matcher: ['/((?!_next/|favicon.ico).*)'],
};
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // Get the origin from the request
    const origin = request.headers.get("origin") || "";

    // List of allowed origins
    const allowedOrigins = [
      "http://localhost:3000", // Local development
      "https://ezcrack.vercel.app", // Production
      // Add any other allowed origins here
    ];

    // Check if the origin is allowed
    if (!allowedOrigins.includes(origin) && origin !== "") {
      return new NextResponse(JSON.stringify({ error: "Not authorized" }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // For actual requests, add CORS headers to the response
    const response = NextResponse.next();

    // Only add the specific origin that's allowed, not a wildcard
    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/api/:path*",
};

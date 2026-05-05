import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // Public routes (no auth required)
  const publicRoutes = ["/login", "/signup", "/"];

  // API routes (handled by their own middleware)
  const apiRoutes = pathname.startsWith("/api");

  // Check if accessing public routes
  const isPublicRoute = publicRoutes.includes(pathname);

  // If accessing API routes, let them pass (they have their own auth checks)
  if (apiRoutes) {
    return NextResponse.next();
  }

  // If no token and trying to access protected route
  if (!token) {
    // Allow access to public routes (/login, /signup, /)
    if (isPublicRoute) {
      return NextResponse.next();
    }

    // Redirect to root for protected routes
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If has token and trying to access auth pages, redirect to dashboard
  if (token && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing root with token, redirect to dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

// Allow all /dashboard routes
if (token && pathname.startsWith("/dashboard")) {
  return NextResponse.next();
}
  // Allow all other valid requests
  return NextResponse.next();
}

// Configure which routes to apply middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

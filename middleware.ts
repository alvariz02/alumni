import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  console.log("🔐 Middleware - Path:", pathname)
  console.log("🔐 Middleware - Session:", req.auth)

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/"]
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log("✅ Public route - allowing access")
    return NextResponse.next()
  }

  // API routes handle their own authentication - don't block here
  if (pathname.startsWith("/api/")) {
    console.log("✅ API route - allowing access")
    return NextResponse.next()
  }

  // Protected routes - require authentication
  const session = req.auth
  if (!session || !session.user) {
    console.log("❌ No session - redirecting to login")
    return NextResponse.redirect(new URL("/login", req.url))
  }

  console.log("✅ User authenticated:", session.user.email, "Role:", (session.user as any).role)

  // Role-based route protection
  const userRole = (session.user as any).role

  // Admin routes
  if (pathname.startsWith("/admin")) {
    console.log("🔍 Admin route check - User role:", userRole)
    if (userRole?.toUpperCase() !== "ADMIN") {
      console.log("❌ Not admin - redirecting to dashboard")
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    console.log("✅ Admin access granted")
  }

  // Analytics routes (pimpinan)
  if (pathname.startsWith("/analytics")) {
    console.log("🔍 Analytics route check - User role:", userRole)
    if (!["ADMIN", "PIMPINAN"].includes(userRole?.toUpperCase() || "")) {
      console.log("❌ Not admin/pimpinan - redirecting to dashboard")
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
    console.log("✅ Analytics access granted")
  }

  // Alumni dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile") || pathname.startsWith("/karier") || pathname.startsWith("/network") || pathname.startsWith("/testimoni")) {
    if (userRole?.toUpperCase() === "ADMIN" || userRole?.toUpperCase() === "PIMPINAN") {
      // Redirect admin/pimpinan to their appropriate dashboard
      const redirectUrl = userRole?.toUpperCase() === "ADMIN" ? "/admin/dashboard" : "/analytics"
      console.log("🔄 Admin/pimpinan on alumni route - redirecting to:", redirectUrl)
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }
    console.log("✅ Alumni dashboard access granted")
  }

  console.log("✅ Access granted to:", pathname)
  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

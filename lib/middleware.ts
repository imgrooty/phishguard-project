// middleware.ts
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*"], // protects /dashboard and its subpaths
};

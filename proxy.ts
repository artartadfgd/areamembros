import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // All paths except /api, /admin (not localized — owner-only), /_next,
    // /_vercel, or ones containing a dot (static files like favicon.ico).
    "/((?!api|admin|_next|_vercel|.*\\..*).*)",
  ],
};

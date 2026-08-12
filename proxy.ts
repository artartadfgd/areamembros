import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Todos os paths exceto os que começam com /api, /_next, /_vercel
    // ou que contenham um ponto (arquivos estáticos como favicon.ico).
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

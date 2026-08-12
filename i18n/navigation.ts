import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Link/router/redirect cientes de locale e dos pathnames traduzidos. */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

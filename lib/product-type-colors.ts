import type { ProductType } from "./types";

/**
 * One strong, distinct color per product type — used on the type badge
 * and the generated cover, like color-coded school subject folders.
 * `strong` is the bold color (icons, borders), `soft` is its light
 * tint (badge/cover background), `ink` is a readable-on-`soft` shade
 * of the same hue (badge text).
 *
 * These point at the `--type-*` custom properties in app/globals.css
 * (not raw hex) so the dark theme can swap in its own values — the
 * browser resolves the right one at paint time, no JS involved.
 */
export const PRODUCT_TYPE_COLOR: Record<
  ProductType,
  { strong: string; soft: string; ink: string }
> = {
  course: {
    strong: "var(--type-course)",
    soft: "var(--type-course-soft)",
    ink: "var(--type-course-ink)",
  },
  video: {
    strong: "var(--type-video)",
    soft: "var(--type-video-soft)",
    ink: "var(--type-video-ink)",
  },
  ebook: {
    strong: "var(--type-ebook)",
    soft: "var(--type-ebook-soft)",
    ink: "var(--type-ebook-ink)",
  },
  file_bundle: {
    strong: "var(--type-bundle)",
    soft: "var(--type-bundle-soft)",
    ink: "var(--type-bundle-ink)",
  },
  other: {
    strong: "var(--type-other)",
    soft: "var(--type-other-soft)",
    ink: "var(--type-other-ink)",
  },
};

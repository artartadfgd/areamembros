import type { ProductType } from "./types";

/**
 * One strong, distinct color per product type — used on the type badge
 * and the generated cover, like color-coded school subject folders.
 * `strong` is the bold color (icons, borders), `soft` is its light
 * tint (badge/cover background), `ink` is a readable-on-`soft` shade
 * of the same hue (badge text).
 */
export const PRODUCT_TYPE_COLOR: Record<
  ProductType,
  { strong: string; soft: string; ink: string }
> = {
  course: { strong: "#2F6FED", soft: "#E3ECFE", ink: "#1D4FBF" },
  video: { strong: "#8B5CF6", soft: "#EFE9FE", ink: "#6D3FE0" },
  ebook: { strong: "#0EA5A8", soft: "#DBF5F5", ink: "#0B7A7D" },
  file_bundle: { strong: "#EC4899", soft: "#FCE7F3", ink: "#C22A72" },
  other: { strong: "#F59E0B", soft: "#FEF3C7", ink: "#B4740A" },
};

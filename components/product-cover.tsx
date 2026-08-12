import { BookOpen, FileText, Package, PlayCircle, Sparkles } from "lucide-react";
import type { ProductType } from "@/lib/types";
import { PRODUCT_TYPE_COLOR } from "@/lib/product-type-colors";
import { cn } from "@/lib/cn";

/**
 * We don't have real cover images yet, so we generate an on-brand
 * cover instead: a soft tint of the product's type color with a bold
 * icon, plus a thicker color bar along the bottom edge — like a
 * color-coded school folder. Once `coverUrl` exists, the ProductCard
 * swaps this out for the real image.
 */
const ICONS: Record<ProductType, typeof BookOpen> = {
  course: BookOpen,
  video: PlayCircle,
  ebook: FileText,
  file_bundle: Package,
  other: Sparkles,
};

export function ProductCover({
  type,
  className,
}: {
  type: ProductType;
  className?: string;
}) {
  const Icon = ICONS[type];
  const color = PRODUCT_TYPE_COLOR[type];

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ backgroundColor: color.soft }}
    >
      <Icon className="h-10 w-10" style={{ color: color.strong }} strokeWidth={1.5} aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1.5" style={{ backgroundColor: color.strong }} />
    </div>
  );
}

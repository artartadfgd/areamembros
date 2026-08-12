import { BookOpen, FileText, Package, PlayCircle, Sparkles } from "lucide-react";
import type { ProductType } from "@/lib/types";
import { PRODUCT_TYPE_COLOR } from "@/lib/product-type-colors";
import { cn } from "@/lib/cn";

/**
 * Shows the product's real cover photo when one was uploaded in
 * /admin. Otherwise generates an on-brand placeholder instead: a soft
 * tint of the product's type color with a bold icon, plus a thicker
 * color bar along the bottom edge — like a color-coded school folder.
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
  coverUrl,
  className,
}: {
  type: ProductType;
  coverUrl?: string | null;
  className?: string;
}) {
  if (coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- covers come from an admin-chosen Supabase Storage URL, not a fixed domain we can preconfigure for next/image
      <img src={coverUrl} alt="" className={cn("object-cover", className)} />
    );
  }

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

import { BookOpen, FileText, Package, PlayCircle, Sparkles } from "lucide-react";
import type { ProductType } from "@/lib/types";
import { cn } from "@/lib/cn";

/**
 * We don't have real cover images yet, so we generate an on-brand
 * "tech" cover: a dark panel with a faint grid texture and a glowing
 * outline icon for the product type. Once `coverUrl` exists, the
 * ProductCard swaps this out for the real image.
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

  return (
    <div
      className={cn(
        "grid-texture relative flex items-center justify-center bg-bg-subtle",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg/60" />
      <Icon
        className="relative h-9 w-9 text-accent drop-shadow-[0_0_18px_var(--color-accent)]"
        strokeWidth={1.25}
        aria-hidden
      />
    </div>
  );
}

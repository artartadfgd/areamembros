import { BookOpen, FileText, Package, PlayCircle, Sparkles } from "lucide-react";
import type { ProductType } from "@/lib/types";

/**
 * Como ainda não temos capas reais enviadas pelo admin, geramos uma
 * capa "de identidade" com gradiente + ícone do tipo de produto — tudo
 * dentro da família de cores da marca (nada de azul/roxo aleatório).
 * Quando `coverUrl` existir, o ProductCard usa a imagem real no lugar.
 */
const GRADIENTS: [string, string][] = [
  ["#bf5730", "#7a3420"],
  ["#c98a3e", "#8a5a1f"],
  ["#8f6a4a", "#4b3524"],
  ["#5c6b4c", "#2f3a26"],
  ["#a8563f", "#5c2a1c"],
  ["#7a5240", "#3a271d"],
];

const ICONS: Record<ProductType, typeof BookOpen> = {
  course: BookOpen,
  video: PlayCircle,
  ebook: FileText,
  file_bundle: Package,
  other: Sparkles,
};

function hashToIndex(input: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

export function ProductCover({
  slug,
  type,
  className,
}: {
  slug: string;
  type: ProductType;
  className?: string;
}) {
  const [from, to] = GRADIENTS[hashToIndex(slug, GRADIENTS.length)];
  const Icon = ICONS[type];

  return (
    <div
      className={className}
      style={{
        background: `linear-gradient(155deg, ${from}, ${to})`,
      }}
    >
      <Icon
        className="h-10 w-10 text-white/25"
        strokeWidth={1.25}
        aria-hidden
      />
    </div>
  );
}

import { PackageOpen } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-20 text-center">
      <PackageOpen className="h-8 w-8 text-ink-faint" strokeWidth={1.25} />
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
    </div>
  );
}

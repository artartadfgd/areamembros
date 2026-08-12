import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapProductRow } from "@/lib/get-catalog";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: row } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

  if (!row) notFound();

  const product = mapProductRow(row);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">Edit product</h1>
        <DeleteProductButton id={product.id} />
      </div>
      <ProductForm product={product} />
    </div>
  );
}

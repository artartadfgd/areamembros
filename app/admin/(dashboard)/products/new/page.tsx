import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-ink">Add product</h1>
      <ProductForm />
    </div>
  );
}

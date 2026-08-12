"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductType } from "@/lib/types";

export type ProductFormState = { error: string | null };

const PRODUCT_TYPES: ProductType[] = ["course", "video", "ebook", "file_bundle", "other"];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function field(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value.length > 0 ? value : null;
}

export async function saveProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  if (!(await isAdmin())) {
    return { error: "Not authorized." };
  }

  const id = field(formData, "id");
  const title = field(formData, "title");
  if (!title) return { error: "Title is required." };

  const slug = slugify(field(formData, "slug") ?? title);
  if (!slug) return { error: "Couldn't generate a slug from that title — set one manually." };

  const type = field(formData, "type");
  if (!type || !PRODUCT_TYPES.includes(type as ProductType)) {
    return { error: "Pick a valid product type." };
  }

  const priceDollars = Number(formData.get("price") ?? 0);
  const priceCents = Number.isFinite(priceDollars) ? Math.round(priceDollars * 100) : 0;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  const row: Record<string, unknown> = {
    title,
    slug,
    short_description: field(formData, "shortDescription"),
    description: field(formData, "description") ?? "",
    price_cents: priceCents,
    currency: field(formData, "currency") ?? "USD",
    type,
    hotmart_product_id: field(formData, "hotmartProductId"),
    checkout_url: field(formData, "checkoutUrl"),
    preview_url: field(formData, "previewUrl"),
    external_url: field(formData, "externalUrl"),
    is_published: formData.get("isPublished") === "on",
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
  };

  const supabase = createAdminClient();

  try {
    const coverImage = formData.get("coverImage");
    if (coverImage && typeof coverImage !== "string" && coverImage.size > 0) {
      const extension = coverImage.name.split(".").pop() || "jpg";
      const path = `${slug}-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("product-covers")
        .upload(path, coverImage, { contentType: coverImage.type, upsert: true });

      if (uploadError) {
        return { error: `Cover photo upload failed: ${uploadError.message}` };
      }

      row.cover_url = supabase.storage.from("product-covers").getPublicUrl(path).data.publicUrl;
    }

    const { error } = id
      ? await supabase.from("products").update(row).eq("id", id)
      : await supabase.from("products").insert(row);

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Something went wrong saving the product.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProductAction(id: string) {
  if (!(await isAdmin())) return;

  const supabase = createAdminClient();
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin");
  redirect("/admin");
}

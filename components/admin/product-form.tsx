"use client";

import { useActionState } from "react";
import { saveProductAction, type ProductFormState } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

const initialState: ProductFormState = { error: null };

const inputClass =
  "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-accent";
const labelClass = "text-sm font-medium text-ink";

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, isPending] = useActionState(saveProductAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={product?.title}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="slug">
          Slug (leave blank to generate from the title)
        </label>
        <input id="slug" name="slug" defaultValue={product?.slug} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="shortDescription">
          Short description (shown on the catalog card)
        </label>
        <input
          id="shortDescription"
          name="shortDescription"
          defaultValue={product?.shortDescription ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="coverImage">
          Cover photo (optional — falls back to a colored icon if empty)
        </label>
        {product?.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an already-uploaded file
          <img
            src={product.coverUrl}
            alt=""
            className="h-32 w-full max-w-xs rounded-md border border-border object-cover"
          />
        )}
        <input
          id="coverImage"
          name="coverImage"
          type="file"
          accept="image/*"
          className="text-sm text-ink-muted file:mr-3 file:rounded-full file:border-0 file:bg-bg-subtle file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-border"
        />
        <p className="text-xs text-ink-faint">
          {product?.coverUrl
            ? "Choose a file to replace the current photo, or leave empty to keep it."
            : "JPG or PNG, a few MB max."}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="description">
          Full description (shown on the product page)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="price">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product ? (product.priceCents / 100).toFixed(2) : undefined}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="currency">
            Currency
          </label>
          <input
            id="currency"
            name="currency"
            defaultValue={product?.currency ?? "USD"}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="type">
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={product?.type ?? "course"}
          className={inputClass}
        >
          <option value="course">Course</option>
          <option value="video">Video</option>
          <option value="ebook">E-book</option>
          <option value="file_bundle">File bundle</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="hotmartProductId">
          Hotmart product ID (from the product&apos;s settings on Hotmart)
        </label>
        <input
          id="hotmartProductId"
          name="hotmartProductId"
          defaultValue={product?.hotmartProductId ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="checkoutUrl">
          Checkout URL (Hotmart buy link)
        </label>
        <input
          id="checkoutUrl"
          name="checkoutUrl"
          type="url"
          defaultValue={product?.checkoutUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="previewUrl">
          Free preview URL (optional)
        </label>
        <input
          id="previewUrl"
          name="previewUrl"
          type="url"
          defaultValue={product?.previewUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="externalUrl">
          External app URL (optional — if this product&apos;s content already lives
          in an app you have, unlocking it redirects here instead of listing
          content)
        </label>
        <input
          id="externalUrl"
          name="externalUrl"
          type="url"
          defaultValue={product?.externalUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={product?.isPublished ?? true}
            className="h-4 w-4 accent-accent"
          />
          Published (visible in the catalog)
        </label>

        <div className="flex items-center gap-2">
          <label className={labelClass} htmlFor="sortOrder">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            className={`${inputClass} w-20`}
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-accent" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-fit items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save product"}
      </button>
    </form>
  );
}

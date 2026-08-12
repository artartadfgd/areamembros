export type ProductType = "course" | "video" | "ebook" | "file_bundle" | "other";

export type PurchaseStatus =
  | "approved"
  | "refunded"
  | "canceled"
  | "chargeback"
  | "expired";

export type ContentItem = {
  type: "video" | "pdf" | "file" | "link";
  title: string;
  url: string;
  durationMinutes?: number;
};

/** Espelha a tabela `products` do Supabase. */
export type Product = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string;
  coverUrl: string | null;
  priceCents: number;
  currency: string;
  type: ProductType;
  hotmartProductId: string | null;
  checkoutUrl: string | null;
  previewUrl: string | null;
  /** When set, this product's content lives in an existing external app —
   *  unlocking it just redirects here instead of listing content below. */
  externalUrl: string | null;
  content: ContentItem[];
  isPublished: boolean;
  sortOrder: number;
};

/** Espelha a tabela `purchases` do Supabase, já filtrada por e-mail. */
export type Purchase = {
  id: string;
  productId: string;
  status: PurchaseStatus;
  purchasedAt: string;
};

/** Produto do catálogo já combinado com o status de compra do usuário atual. */
export type CatalogProduct = Product & {
  isUnlocked: boolean;
};

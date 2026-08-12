import type { CatalogProduct } from "./types";

/**
 * Mock data for the first version of the catalog, before wiring up the
 * real Supabase queries. The shape already matches what we'll fetch
 * from the database (see supabase/migrations/0001_init.sql), so
 * swapping this for a real query later is a one-file change.
 *
 * `isUnlocked` simulates a visitor who already purchased 2 of the 6
 * products, so both states show up side by side.
 */
export const mockCatalog: CatalogProduct[] = [
  {
    id: "1",
    slug: "product-photography-from-scratch",
    title: "Product Photography From Scratch",
    shortDescription:
      "Shoot professional product photos with nothing but your phone.",
    description:
      "A complete course on photographing products with just your phone: lighting, composition, editing, and low-cost setups. Includes a gear checklist and editing presets.",
    coverUrl: null,
    priceCents: 19700,
    currency: "USD",
    type: "course",
    hotmartProductId: "HTM-10234",
    checkoutUrl: "https://pay.hotmart.com/example-photography",
    previewUrl: "https://example.com/preview/photography-lesson-1",
    // Example of a product whose content already lives in an existing
    // app — the "Access" button redirects there instead of listing
    // `content` below (extras like the checklist still show underneath).
    externalUrl: "https://app.example.com/courses/product-photography",
    content: [
      { type: "video", title: "Lesson 1 — DIY lighting kit", url: "#", durationMinutes: 14 },
      { type: "video", title: "Lesson 2 — Composition & framing", url: "#", durationMinutes: 18 },
      { type: "video", title: "Lesson 3 — Editing on your phone", url: "#", durationMinutes: 22 },
      { type: "pdf", title: "Gear checklist", url: "#" },
    ],
    isPublished: true,
    sortOrder: 1,
    isUnlocked: true,
  },
  {
    id: "2",
    slug: "pricing-guide-for-freelancers",
    title: "Pricing Guide for Freelancers",
    shortDescription:
      "Find out what to charge without second-guessing yourself, with a pricing spreadsheet included.",
    description:
      "A straight-to-the-point e-book on pricing your freelance services: fixed costs, margins, perceived value, and how to raise rates with existing clients without losing them. Comes with a pricing spreadsheet.",
    coverUrl: null,
    priceCents: 4700,
    currency: "USD",
    type: "ebook",
    hotmartProductId: "HTM-10235",
    checkoutUrl: "https://pay.hotmart.com/example-pricing",
    previewUrl: null,
    externalUrl: null,
    content: [
      { type: "pdf", title: "Pricing Guide (PDF)", url: "#" },
      { type: "file", title: "Pricing spreadsheet", url: "#" },
    ],
    isPublished: true,
    sortOrder: 2,
    isUnlocked: true,
  },
  {
    id: "3",
    slug: "contract-templates-for-freelancers",
    title: "Contract Templates for Freelancers",
    shortDescription:
      "8 ready-to-edit contract templates for working with clients.",
    description:
      "A bundle of 8 contract templates for freelancers and service providers, ready to edit in Word or Google Docs: service agreements, NDAs, image rights, and more.",
    coverUrl: null,
    priceCents: 8900,
    currency: "USD",
    type: "file_bundle",
    hotmartProductId: "HTM-10236",
    checkoutUrl: "https://pay.hotmart.com/example-contracts",
    previewUrl: null,
    externalUrl: null,
    content: [],
    isPublished: true,
    sortOrder: 3,
    isUnlocked: false,
  },
  {
    id: "4",
    slug: "mobile-video-editing-masterclass",
    title: "Mobile Video Editing Masterclass",
    shortDescription:
      "Edit videos that look professional using nothing but your phone.",
    description:
      "A video masterclass walking through a complete editing workflow for social media using free mobile apps: dynamic cuts, captions, transitions, and sound design.",
    coverUrl: null,
    priceCents: 14700,
    currency: "USD",
    type: "video",
    hotmartProductId: "HTM-10237",
    checkoutUrl: "https://pay.hotmart.com/example-editing",
    previewUrl: "https://example.com/preview/editing-teaser",
    externalUrl: null,
    content: [],
    isPublished: true,
    sortOrder: 4,
    isUnlocked: false,
  },
  {
    id: "5",
    slug: "persuasive-copywriting",
    title: "Persuasive Copywriting",
    shortDescription:
      "Write sales copy that converts, even with zero experience.",
    description:
      "A hands-on copywriting course for anyone selling products or services online: mental triggers, sales-page structure, and emails and ads that convert.",
    coverUrl: null,
    priceCents: 24700,
    currency: "USD",
    type: "course",
    hotmartProductId: "HTM-10238",
    checkoutUrl: "https://pay.hotmart.com/example-copy",
    previewUrl: null,
    externalUrl: null,
    content: [],
    isPublished: true,
    sortOrder: 5,
    isUnlocked: false,
  },
  {
    id: "6",
    slug: "financial-planner-2026",
    title: "Financial Planner 2026",
    shortDescription:
      "Organize your personal finances month by month, without the spreadsheet headache.",
    description:
      "A digital planner to track income, expenses, and savings goals throughout 2026, with a printable version and an editable tablet version.",
    coverUrl: null,
    priceCents: 3700,
    currency: "USD",
    type: "ebook",
    hotmartProductId: "HTM-10239",
    checkoutUrl: "https://pay.hotmart.com/example-planner",
    previewUrl: null,
    externalUrl: null,
    content: [],
    isPublished: true,
    sortOrder: 6,
    isUnlocked: false,
  },
];

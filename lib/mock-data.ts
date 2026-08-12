import type { CatalogProduct } from "./types";

/**
 * Dados mockados para a primeira versão da vitrine, antes de ligar o
 * Supabase de verdade. O formato já é idêntico ao que vamos buscar do
 * banco (ver supabase/migrations/0001_init.sql), então trocar por uma
 * query real depois é só isso — trocar a fonte dos dados.
 *
 * `isUnlocked` simula um visitante que já comprou 2 dos 6 produtos,
 * para mostrar os dois estados do catálogo lado a lado.
 */
export const mockCatalog: CatalogProduct[] = [
  {
    id: "1",
    slug: "fotografia-de-produtos-do-zero",
    title: "Fotografia de Produtos do Zero",
    shortDescription:
      "Fotografe seus produtos com o celular e venda mais com fotos profissionais.",
    description:
      "Um curso completo para você aprender a fotografar produtos usando apenas o celular: iluminação, composição, edição e cenários de baixo custo. Inclui checklist de equipamentos e presets de edição.",
    coverUrl: null,
    priceCents: 19700,
    currency: "BRL",
    type: "course",
    hotmartProductId: "HTM-10234",
    checkoutUrl: "https://pay.hotmart.com/exemplo-fotografia",
    previewUrl: "https://example.com/preview/fotografia-aula-1",
    content: [
      { type: "video", title: "Aula 1 — Kit de iluminação caseiro", url: "#", durationMinutes: 14 },
      { type: "video", title: "Aula 2 — Composição e enquadramento", url: "#", durationMinutes: 18 },
      { type: "video", title: "Aula 3 — Edição no celular", url: "#", durationMinutes: 22 },
      { type: "pdf", title: "Checklist de equipamentos", url: "#" },
    ],
    isPublished: true,
    sortOrder: 1,
    isUnlocked: true,
  },
  {
    id: "2",
    slug: "guia-de-precificacao-para-freelancers",
    title: "Guia de Precificação para Freelancers",
    shortDescription:
      "Descubra quanto cobrar sem medo, com planilha de cálculo inclusa.",
    description:
      "E-book direto ao ponto sobre como precificar seus serviços como freelancer: custos fixos, margem, valor percebido e como reajustar clientes antigos sem perdê-los. Acompanha planilha de precificação.",
    coverUrl: null,
    priceCents: 4700,
    currency: "BRL",
    type: "ebook",
    hotmartProductId: "HTM-10235",
    checkoutUrl: "https://pay.hotmart.com/exemplo-precificacao",
    previewUrl: null,
    content: [
      { type: "pdf", title: "Guia de Precificação (PDF)", url: "#" },
      { type: "file", title: "Planilha de cálculo", url: "#" },
    ],
    isPublished: true,
    sortOrder: 2,
    isUnlocked: true,
  },
  {
    id: "3",
    slug: "templates-de-contrato-para-prestadores",
    title: "Templates de Contrato para Prestadores",
    shortDescription:
      "8 modelos de contrato prontos para editar e usar com seus clientes.",
    description:
      "Um pacote com 8 modelos de contrato para prestadores de serviço, prontos para editar em Word ou Google Docs: prestação de serviço, confidencialidade, cessão de imagem e mais.",
    coverUrl: null,
    priceCents: 8900,
    currency: "BRL",
    type: "file_bundle",
    hotmartProductId: "HTM-10236",
    checkoutUrl: "https://pay.hotmart.com/exemplo-contratos",
    previewUrl: null,
    content: [],
    isPublished: true,
    sortOrder: 3,
    isUnlocked: false,
  },
  {
    id: "4",
    slug: "masterclass-edicao-de-video-no-celular",
    title: "Masterclass: Edição de Vídeo no Celular",
    shortDescription:
      "Edite vídeos com cara de profissional usando só o app do seu celular.",
    description:
      "Masterclass em vídeo mostrando um fluxo completo de edição para redes sociais usando apps gratuitos de celular: cortes dinâmicos, legendas, transições e trilha sonora.",
    coverUrl: null,
    priceCents: 14700,
    currency: "BRL",
    type: "video",
    hotmartProductId: "HTM-10237",
    checkoutUrl: "https://pay.hotmart.com/exemplo-edicao",
    previewUrl: "https://example.com/preview/edicao-teaser",
    content: [],
    isPublished: true,
    sortOrder: 4,
    isUnlocked: false,
  },
  {
    id: "5",
    slug: "copywriting-persuasivo",
    title: "Copywriting Persuasivo",
    shortDescription:
      "Escreva textos de venda que convertem, mesmo sem experiência.",
    description:
      "Curso prático de copywriting para quem vende produtos ou serviços online: gatilhos mentais, estrutura de páginas de venda, e-mails e anúncios que convertem.",
    coverUrl: null,
    priceCents: 24700,
    currency: "BRL",
    type: "course",
    hotmartProductId: "HTM-10238",
    checkoutUrl: "https://pay.hotmart.com/exemplo-copy",
    previewUrl: null,
    content: [],
    isPublished: true,
    sortOrder: 5,
    isUnlocked: false,
  },
  {
    id: "6",
    slug: "planner-financeiro-2026",
    title: "Planner Financeiro 2026",
    shortDescription:
      "Organize suas finanças pessoais mês a mês, de forma simples.",
    description:
      "Planner digital para organizar receitas, despesas e metas de economia ao longo de 2026, com versão para imprimir e versão editável para tablet.",
    coverUrl: null,
    priceCents: 3700,
    currency: "BRL",
    type: "ebook",
    hotmartProductId: "HTM-10239",
    checkoutUrl: "https://pay.hotmart.com/exemplo-planner",
    previewUrl: null,
    content: [],
    isPublished: true,
    sortOrder: 6,
    isUnlocked: false,
  },
];

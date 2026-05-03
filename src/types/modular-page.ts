export type PublicationStatus = 'draft' | 'published' | 'archived';
export type ImageLayout = 'full_width' | 'centered';

export type PageBlockType =
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'text_image'
  | 'separator'
  | 'cta'
  | 'hero'
  | 'accordion'
  | 'route_card';

// ─── MEDIA & SHARED TYPES ──────────────────────────────────────────────

export interface MediaItem {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface BlockBase {
  id: string;
  order: number;
}

// ─── PAGE BLOCKS ───────────────────────────────────────────────────────

export interface BlockText extends BlockBase {
  type: 'text';
  content: string;
}

export interface BlockImage extends BlockBase {
  type: 'image';
  media: MediaItem;
  layout: ImageLayout;
}

export interface BlockGallery extends BlockBase {
  type: 'gallery';
  images: MediaItem[];
  displayMode?: 'grid' | 'slider' | 'masonry';
}

export interface BlockVideo extends BlockBase {
  type: 'video';
  url: string;
  caption?: string;
}

export interface BlockTextImage extends BlockBase {
  type: 'text_image';
  content: string;
  media: MediaItem;
  imagePosition: 'left' | 'right';
}

export interface BlockSeparator extends BlockBase {
  type: 'separator';
}

export interface BlockCTA extends BlockBase {
  type: 'cta';
  text: string;
  buttonLabel: string;
  buttonLink: string;
}

export interface BlockHero extends BlockBase {
  type: 'hero';
  backgroundMedia: MediaItem; // Image or Video background
  title: string;
  subtitle?: string;
}

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlockAccordion extends BlockBase {
  type: 'accordion';
  items: AccordionItem[];
}

export interface BlockRouteCard extends BlockBase {
  type: 'route_card';
  routeId: string;
}

export type PageBlock =
  | BlockText
  | BlockImage
  | BlockGallery
  | BlockVideo
  | BlockTextImage
  | BlockSeparator
  | BlockCTA
  | BlockHero
  | BlockAccordion
  | BlockRouteCard;

// ─── MODULAR PAGE DATA STRUCTURES ──────────────────────────────────────

export interface CardListingData {
  title: string; // Obrigatório
  image: MediaItem; // Obrigatório - Thumbnail
  shortDescription: string; // Obrigatório - max 150 chars
}

export interface SEOData {
  title: string; // Obrigatório
  metaDescription: string; // Obrigatório
  ogImage?: MediaItem; // Optional - fallback to card image
}

export interface ModularPage {
  id: string;
  slug: string;

  // Secção 1: Card de Listagem
  cardListing: CardListingData;

  // Secção 2: Identidade da Página e SEO
  pageTitle: string; // H1 - Obrigatório
  status: PublicationStatus;
  seo: SEOData;

  // Secção 3: Construtor de Páginas
  blocks: PageBlock[];

  // Secção 4: Ligações ao Ecossistema (opcional)
  relatedRouteIds?: string[];

  // Metadata
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// ─── VALIDATION HELPERS ───────────────────────────────────────────────

export interface ValidationErrors {
  cardTitle?: string;
  cardImage?: string;
  shortDescription?: string;
  pageTitle?: string;
  slug?: string;
  seoTitle?: string;
  metaDescription?: string;
  blocks?: string;
  general?: string;
}

export const validatePageForPublication = (page: ModularPage): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Card Listing validations
  if (!page.cardListing.title?.trim()) {
    errors.cardTitle = 'Título do Card é obrigatório';
  }
  if (!page.cardListing.image?.url) {
    errors.cardImage = 'Imagem do Card é obrigatória';
  }
  if (!page.cardListing.shortDescription?.trim()) {
    errors.shortDescription = 'Descrição Curta do Card é obrigatória';
  }

  // Page Identity validations
  if (!page.pageTitle?.trim()) {
    errors.pageTitle = 'Título Principal da Página é obrigatório';
  }
  if (!page.slug?.trim()) {
    errors.slug = 'Slug é obrigatório';
  }

  // SEO validations
  if (!page.seo.title?.trim()) {
    errors.seoTitle = 'SEO Title é obrigatório';
  }
  if (!page.seo.metaDescription?.trim()) {
    errors.metaDescription = 'Meta Description é obrigatória';
  }

  // Block validation
  if (!page.blocks || page.blocks.length === 0) {
    errors.blocks = 'A página deve ter pelo menos 1 bloco';
  }

  return errors;
};

export const isPagePublishable = (page: ModularPage): boolean => {
  const errors = validatePageForPublication(page);
  return Object.keys(errors).length === 0;
};

export type PublicationStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type BlockType =
  | 'text'
  | 'image'
  | 'gallery'
  | 'video'
  | 'quote'
  | 'text_image'
  | 'separator'
  | 'cta'
  | 'route_card'
  | 'related_articles';

export type ImageLayout = 'full_width' | 'centered';
export type DifficultyLevel = 'easy' | 'moderate' | 'hard';
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
  displayMode: 'grid' | 'slider' | 'masonry';
}

export interface BlockVideo extends BlockBase {
  type: 'video';
  url: string;       
  caption?: string;
}
export interface BlockQuote extends BlockBase {
  type: 'quote';
  text: string;
  author?: string;
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
export interface BlockRouteCard extends BlockBase {
  type: 'route_card';
  routeId: string;  
}

export interface BlockRelatedArticles extends BlockBase {
  type: 'related_articles';
  articleIds: string[]; 
}

export type ArticleBlock =
  | BlockText
  | BlockImage
  | BlockGallery
  | BlockVideo
  | BlockQuote
  | BlockTextImage
  | BlockSeparator
  | BlockCTA
  | BlockRouteCard
  | BlockRelatedArticles;

  export interface Author {
  id: string;
  name: string;
  slug: string;
  photo?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
}
export interface EditorialSeries {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}
export interface SEOMeta {
  title: string;         
  description: string;   
  canonicalUrl?: string;
  ogImage?: string;
  indexable: boolean;
}

export interface Article {
  id: string;
  slug: string;
  language: string;

  title: string;
  subtitle?: string;
  excerpt: string;         
  intro?: string;
  blocks: ArticleBlock[];  

  heroImage: MediaItem;
  thumbnailImage?: MediaItem;
  featuredVideo?: string;

  authorId: string;
  categoryIds: string[];
  tagIds: string[];
  seriesId: string;
  relatedRouteIds?: string[];
  relatedDestinationIds?: string[];
  relatedExperienceIds?: string[];

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  status: PublicationStatus;

  featured: boolean;
  featuredOrder?: number;
  commentsEnabled: boolean;

  seo: SEOMeta;
}
export interface ArticleCard {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  heroImage: MediaItem;
  thumbnailImage?: MediaItem;
  author: Author;
  publishedAt: string;
  categories: Category[];
  series: EditorialSeries;
  readingTimeMinutes?: number;
}
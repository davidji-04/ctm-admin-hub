export type ImageType = 'hero' | 'galeria';

export interface RouteImage {
  id: string;
  percurso_id: string;
  tipo: ImageType;
  url: string;
  filename: string;
  ordem?: number; // For gallery images ordering
  width: number;
  height: number;
  size: number; // in bytes
  uploadedAt: string;
}

export type ImageFormData = Omit<RouteImage, 'id' | 'uploadedAt'>;

// Validation constraints
export const IMAGE_CONSTRAINTS = {
  HERO_MIN_WIDTH: 1920,
  HERO_MIN_HEIGHT: 1080,
  HERO_MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};

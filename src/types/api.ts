export interface ImageFile {
  id: string;
  name: string;
  url: string;
  createdTime?: string;
  modifiedTime?: string;
}

export interface GalleryResponse {
  images: ImageFile[];
  error?: string;
}

export interface OptimizeImageParams {
  url: string;
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

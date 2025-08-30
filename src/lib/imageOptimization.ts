// Utility function to generate optimized image URLs
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: {
    width?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
    mobile?: boolean;
  } = {}
) => {
  const { width = 800, quality = 80, format = 'webp', mobile = false } = options;

  // If it's a local image, construct the path properly
  let imagePath = originalUrl;
  if (originalUrl.includes('assets/')) {
    // Local image - remove the import path and use public path
    imagePath = originalUrl.replace(/^.*assets\//, '/assets/');
  }

  // Determine optimal width based on device
  const optimalWidth = mobile ? Math.min(width, 600) : width;

  // Build the optimization URL with cache busting
  const params = new URLSearchParams({
    url: imagePath,
    w: optimalWidth.toString(),
    q: quality.toString(),
    format,
    v: '2' // Cache busting version - increment this when making changes
  });

  return `/api/optimize-image?${params.toString()}`;
};

// Generate responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (originalUrl: string) => {
  return {
    mobile: getOptimizedImageUrl(originalUrl, { width: 400, mobile: true }),
    tablet: getOptimizedImageUrl(originalUrl, { width: 600 }),
    desktop: getOptimizedImageUrl(originalUrl, { width: 800 }),
    large: getOptimizedImageUrl(originalUrl, { width: 1200 })
  };
};

// Check if WebP is supported by the browser
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return true; // Server-side, assume support
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
};

// Get the best format for the current browser
export const getBestFormat = (): 'webp' | 'jpeg' => {
  return supportsWebP() ? 'webp' : 'jpeg';
};

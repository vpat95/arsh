import { useOptimizedImage } from "@/hooks/useOptimizedImage";

interface ImageFile {
  id: string;
  name: string;
  url: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface OptimizedImageProps {
  image: ImageFile;
  onLoad: () => void;
  loadedImages: Set<string>;
  isImagePreloaded: (url: string) => boolean;
  className?: string;
}

const OptimizedImage = ({
  image,
  onLoad,
  loadedImages,
  isImagePreloaded,
  className = "w-full h-64 object-cover transition-all duration-1000 group-hover:scale-110",
}: OptimizedImageProps) => {
  const { optimizedUrl } = useOptimizedImage(image.url, {
    width: 800,
    quality: 80,
  });

  const shouldShowBlur = !(
    (
      loadedImages.has(image.id) ||
      isImagePreloaded(image.url) ||
      image.url.includes("assets/")
    ) // Local images don't need blur
  );

  // Debug logging for mobile blur state
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    console.log(`Mobile image ${image.id}:`, {
      shouldShowBlur,
      isLoaded: loadedImages.has(image.id),
      isPreloaded: isImagePreloaded(image.url),
      isLocal: image.url.includes("assets/"),
      optimizedUrl: !!optimizedUrl,
    });
  }

  return (
    <div className="relative w-full h-64 overflow-hidden">
      <img
        src={optimizedUrl || image.url} // Fallback to original if optimization fails
        alt={image.name}
        className={`${className} ${
          shouldShowBlur ? "blur-md scale-110" : "blur-none"
        }`}
        onLoad={onLoad}
        onError={(e) => {
          console.warn(`Failed to load optimized image: ${image.url}`);
          // Fallback to original image
          if (e.currentTarget.src !== image.url) {
            e.currentTarget.src = image.url;
          } else {
            // If original also fails, show placeholder
            e.currentTarget.style.display = "none";
            const placeholder = document.createElement("div");
            placeholder.className =
              "absolute inset-0 bg-gray-200 flex items-center justify-center";
            placeholder.innerHTML = `
              <div class="text-center">
                <div class="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span class="text-xl">📷</span>
                </div>
                <p class="text-sm text-muted-foreground">Image unavailable</p>
              </div>
            `;
            e.currentTarget.parentElement?.appendChild(placeholder);
          }
        }}
        loading={
          image.url.includes("assets/") || isImagePreloaded(image.url)
            ? "eager"
            : "lazy"
        }
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;

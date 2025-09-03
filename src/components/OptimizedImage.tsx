import { useOptimizedImage } from "@/hooks/useOptimizedImage";
import { convertHeicToJpeg, isHeicFile } from "@/lib/imageConversion";
import { useEffect, useState } from "react";

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
  const [displayUrl, setDisplayUrl] = useState<string>(image.url);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const isLocalImage = image.url.includes("assets/");
  const { optimizedUrl } = useOptimizedImage(image.url, {
    width: 800,
    quality: 80,
  });

  // Handle HEIC conversion
  useEffect(() => {
    const convertHeicIfNeeded = async () => {
      console.log("Checking if image needs conversion:", {
        imageName: image.name,
        imageUrl: image.url,
        isHeic: isHeicFile(image),
        alreadyConverted: displayUrl.includes("blob:"),
      });

      // Only convert if it's a HEIC file and not already converted
      if (isHeicFile(image) && !displayUrl.includes("blob:")) {
        console.log("Starting HEIC conversion for:", image.name);
        setIsConverting(true);
        setConversionError(null);

        try {
          // Create a File object from the image URL for conversion
          const response = await fetch(image.url);
          const blob = await response.blob();
          const file = new File([blob], image.name || "image.heic", {
            type: blob.type,
          });

          console.log("Created file for conversion:", file);
          const result = await convertHeicToJpeg(file);

          // Create a blob URL for the converted image
          const convertedBlobUrl = URL.createObjectURL(result.file);
          console.log("Conversion successful, setting display URL");
          setDisplayUrl(convertedBlobUrl);

          // Clean up the blob URL when component unmounts
          return () => URL.revokeObjectURL(convertedBlobUrl);
        } catch (error) {
          console.error("HEIC conversion failed:", error);
          setConversionError("Failed to convert HEIC image");
          // Keep original URL as fallback
        } finally {
          setIsConverting(false);
        }
      }
    };

    convertHeicIfNeeded();
  }, [image.url, image.name]);

  const shouldShowBlur = !(
    loadedImages.has(image.id) ||
    isImagePreloaded(image.url) ||
    isLocalImage ||
    isConverting
  );

  // Debug logging for mobile blur state
  if (typeof window !== "undefined" && window.innerWidth <= 768) {
    console.log(`Mobile image ${image.id}:`, {
      shouldShowBlur,
      isLoaded: loadedImages.has(image.id),
      isPreloaded: isImagePreloaded(image.url),
      isLocal: isLocalImage,
      optimizedUrl: !!optimizedUrl,
      isConverting,
      displayUrl: displayUrl.substring(0, 50) + "...",
    });
  }

  // Check if this is being used in a modal (no height constraint)
  const isModalImage =
    className.includes("max-h-full") && className.includes("w-auto");

  return (
    <div
      className={`relative ${
        isModalImage ? "w-full h-full" : "w-full h-64"
      } overflow-hidden`}
    >
      {isConverting ? (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Converting HEIC...</p>
          </div>
        </div>
      ) : (
        <img
          src={optimizedUrl || displayUrl} // Use converted URL if available
          alt={image.name}
          className={`${className} ${
            shouldShowBlur ? "blur-md scale-110" : "blur-none"
          }`}
          onLoad={onLoad}
          onError={(e) => {
            console.warn(`Failed to load image: ${displayUrl}`);
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
          loading={isLocalImage ? "eager" : "lazy"}
          decoding="async"
        />
      )}

      {/* Show conversion error if needed */}
      {conversionError && (
        <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">⚠️</span>
            </div>
            <p className="text-xs text-red-600">{conversionError}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

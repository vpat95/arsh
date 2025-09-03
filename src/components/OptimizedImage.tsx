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
  const [imageLoadError, setImageLoadError] = useState(false);

  const isLocalImage = image.url.includes("assets/");
  const hasConvertedHeic = displayUrl.includes("blob:") && isHeicFile(image);

  // Only use optimization hook if we don't have a converted HEIC image
  const { optimizedUrl } = useOptimizedImage(
    hasConvertedHeic ? "" : image.url,
    {
      width: 800,
      quality: 80,
    }
  );

  // Handle HEIC conversion
  useEffect(() => {
    const convertHeicIfNeeded = async () => {
      // Debug mode - set to true to see detailed logs
      const DEBUG = true;

      if (DEBUG) {
        console.log("Checking if image needs conversion:", {
          imageName: image.name,
          imageUrl: image.url,
          isHeic: isHeicFile(image),
          alreadyConverted: displayUrl.includes("blob:"),
        });
      }

      // Only convert if it's a HEIC file and not already converted
      if (isHeicFile(image) && !displayUrl.includes("blob:")) {
        // Check if the URL already points to a converted image or if it's already readable
        if (
          image.url.includes(".jpg") ||
          image.url.includes(".jpeg") ||
          image.url.includes(".png") ||
          image.url.includes(".webp")
        ) {
          if (DEBUG)
            console.log(
              "Image URL already points to a readable format, skipping conversion"
            );
          return;
        }

        // Test if the original image loads successfully first
        const testImage = new Image();
        testImage.onload = () => {
          if (DEBUG)
            console.log(
              "Original image loads successfully, no conversion needed"
            );
          setIsConverting(false);
        };
        testImage.onerror = async () => {
          if (DEBUG)
            console.log("Original image failed to load, attempting conversion");

          // Check the actual content type before attempting conversion
          try {
            const response = await fetch(image.url, { method: "HEAD" });
            const contentType = response.headers.get("content-type");
            if (DEBUG) console.log("Image content type:", contentType);

            // If it's already a readable format, don't convert
            if (
              contentType &&
              (contentType.includes("jpeg") ||
                contentType.includes("png") ||
                contentType.includes("webp"))
            ) {
              if (DEBUG)
                console.log(
                  "Image is already in readable format, no conversion needed"
                );
              setIsConverting(false);
              return;
            }

            // Only convert if the original image fails to load
            await performConversion();
          } catch (error) {
            if (DEBUG)
              console.log(
                "Could not check content type, attempting conversion"
              );
            await performConversion();
          }
        };
        testImage.src = image.url;
      }
    };

    convertHeicIfNeeded();
  }, [image.url, image.name]);

  // Clear error states when displayUrl changes (e.g., after successful conversion)
  useEffect(() => {
    if (displayUrl.includes("blob:")) {
      setImageLoadError(false);
      setConversionError(null);
    }
  }, [displayUrl]);

  const performConversion = async () => {
    const DEBUG = true;
    if (DEBUG) console.log("Starting HEIC conversion for:", image.name);
    setIsConverting(true);
    setConversionError(null);

    try {
      // Create a File object from the image URL for conversion
      const response = await fetch(image.url);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch image: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const file = new File([blob], image.name || "image.heic", {
        type: blob.type,
      });

      if (DEBUG) console.log("Created file for conversion:", file);

      // Check if the blob is already in a readable format
      if (
        blob.type === "image/jpeg" ||
        blob.type === "image/jpg" ||
        blob.type === "image/png" ||
        blob.type === "image/webp"
      ) {
        if (DEBUG)
          console.log("Blob is already in readable format:", blob.type);
        setIsConverting(false);
        return;
      }

      const result = await convertHeicToJpeg(file);

      // Create a blob URL for the converted image
      const convertedBlobUrl = URL.createObjectURL(result.file);
      if (DEBUG) console.log("Conversion successful, setting display URL");
      setDisplayUrl(convertedBlobUrl);
      setImageLoadError(false); // Clear any previous load errors
      setConversionError(null); // Clear any conversion errors

      // Clean up the blob URL when component unmounts
      return () => URL.revokeObjectURL(convertedBlobUrl);
    } catch (error) {
      if (DEBUG) console.error("HEIC conversion failed:", error);

      // If conversion fails, check if the original image is actually readable
      if (
        error instanceof Error &&
        error.message.includes("already browser readable")
      ) {
        if (DEBUG) console.log("Image is already readable, using original");
        setConversionError(null);
      } else {
        setConversionError("Failed to convert HEIC image");
      }
      // Keep original URL as fallback
    } finally {
      setIsConverting(false);
    }
  };

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
      hasConvertedHeic,
      optimizedUrl: !!optimizedUrl,
      isConverting,
      displayUrl: displayUrl.substring(0, 50) + "...",
      finalSrc: hasConvertedHeic ? displayUrl : optimizedUrl || displayUrl,
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
          src={hasConvertedHeic ? displayUrl : optimizedUrl || displayUrl} // Prioritize converted HEIC
          alt={image.name}
          className={`${className} ${
            shouldShowBlur ? "blur-md scale-110" : "blur-none"
          }`}
          onLoad={() => {
            onLoad();
            setImageLoadError(false); // Clear error state when image loads successfully
          }}
          onError={(e) => {
            console.warn(`Failed to load image: ${e.currentTarget.src}`);
            setImageLoadError(true);

            // Fallback to original image if this isn't already the original
            if (e.currentTarget.src !== image.url) {
              e.currentTarget.src = image.url;
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

      {/* Show image unavailable placeholder if needed */}
      {imageLoadError && !isConverting && !hasConvertedHeic && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">📷</span>
            </div>
            <p className="text-sm text-muted-foreground">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

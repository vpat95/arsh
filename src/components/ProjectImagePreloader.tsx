import { useEffect, useState } from "react";

interface ImageFile {
  id: string;
  name: string;
  url: string;
  createdTime?: string;
  modifiedTime?: string;
}

const projectCategories = [
  "kitchen",
  "bathroom",
  "exterior",
  "commercial",
  "handyman",
  "flooring",
];

const ProjectImagePreloader = () => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [isPreloading, setIsPreloading] = useState(false);

  // Preload a single image
  const preloadImage = (url: string) => {
    // Skip local images as they don't need preloading
    if (url.includes("assets/") || url.startsWith("/src/")) {
      return;
    }

    if (preloadedImages.has(url)) return;

    const img = new Image();
    img.onload = () => {
      setPreloadedImages((prev) => new Set(prev).add(url));
    };
    img.onerror = () => {
      console.warn(`Failed to preload project image: ${url}`);
    };
    img.src = url;
  };

  // Preload all images with homepage priority
  useEffect(() => {
    const preloadAllImages = async () => {
      if (isPreloading) return;
      setIsPreloading(true);

      console.log("Starting to preload images with homepage priority...");

      // Step 1: Preload homepage images first (highest priority)
      try {
        console.log("Preloading homepage images...");
        const homeResponse = await fetch("/api/gallery/home");

        if (homeResponse.ok) {
          const homeData = await homeResponse.json();
          const homeImages = homeData.images || [];

          console.log(`Preloading ${homeImages.length} homepage images`);

          // Preload homepage images immediately
          homeImages.forEach((image: ImageFile) => {
            preloadImage(image.url);
          });
        }
      } catch (error) {
        console.warn("Failed to preload homepage images:", error);
      }

      // Step 2: Wait a bit, then preload project images (lower priority)
      setTimeout(async () => {
        console.log("Starting to preload project gallery images...");

        // Fetch and preload images for each category
        for (const category of projectCategories) {
          try {
            const response = await fetch(`/api/gallery/${category}`);

            if (response.ok) {
              const data = await response.json();
              const images = data.images || [];

              console.log(
                `Preloading ${images.length} images for ${category} category`
              );

              // Preload each image
              images.forEach((image: ImageFile) => {
                preloadImage(image.url);
              });
            }
          } catch (error) {
            console.warn(`Failed to preload ${category} images:`, error);
          }
        }

        setIsPreloading(false);
      }, 1000); // Wait 1 second after homepage images before starting project images
    };

    // Start preloading after a short delay to not block initial page load
    const timer = setTimeout(preloadAllImages, 1000); // Reduced from 2000ms to 1000ms

    return () => clearTimeout(timer);
  }, [isPreloading]);

  // This component doesn't render anything visible
  return null;
};

export default ProjectImagePreloader;

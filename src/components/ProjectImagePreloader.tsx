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

  // Preload all project images
  useEffect(() => {
    const preloadProjectImages = async () => {
      if (isPreloading) return;
      setIsPreloading(true);

      console.log("Starting to preload project gallery images...");

      // Fetch and preload images for each category
      for (const category of projectCategories) {
        try {
          const response = await fetch(
            import.meta.env.PROD
              ? `https://arsh-theta.vercel.app/api/gallery/${category}`
              : `/api/gallery/${category}`
          );

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
    };

    // Start preloading after a short delay to not block initial page load
    const timer = setTimeout(preloadProjectImages, 2000);

    return () => clearTimeout(timer);
  }, [isPreloading]);

  // This component doesn't render anything visible
  return null;
};

export default ProjectImagePreloader;

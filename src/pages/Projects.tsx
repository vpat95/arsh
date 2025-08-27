import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Import default test images for each category
import bathroomDefault from "@/assets/bathroom.JPG";
import commercialDefault from "@/assets/commercial.JPG";
import exteriorDefault from "@/assets/exterior.JPG";
import flooringDefault from "@/assets/flooring.JPG";
import handymanDefault from "@/assets/handyman.JPG";
import kitchenDefault from "@/assets/kitchen.JPG";

interface ImageFile {
  id: string;
  name: string;
  url: string;
  createdTime?: string; // Google Drive file creation date
  modifiedTime?: string; // Google Drive file modification date
}

interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Function to sort images by date (newest first)
const sortImagesByDate = (images: ImageFile[]): ImageFile[] => {
  return [...images].sort((a, b) => {
    // If both images have dates, sort by date
    if (a.createdTime && b.createdTime) {
      return (
        new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      );
    }
    // If only one has a date, prioritize the one with date
    if (a.createdTime && !b.createdTime) return -1;
    if (!a.createdTime && b.createdTime) return 1;
    // If neither has a date, maintain original order
    return 0;
  });
};

const projectCategories: ProjectCategory[] = [
  {
    id: "kitchen",
    name: "Kitchen Remodeling",
    description:
      "Transform your kitchen with custom cabinets, countertops, and modern appliances",
    icon: "🍳",
  },
  {
    id: "bathroom",
    name: "Bathroom Renovation",
    description:
      "Create luxurious bathrooms with premium fixtures and tile work",
    icon: "🚿",
  },
  {
    id: "exterior",
    name: "Exterior Work",
    description:
      "Enhance your home's curb appeal with siding, roofing, and outdoor projects",
    icon: "🏠",
  },
  {
    id: "commercial",
    name: "Commercial Projects",
    description:
      "Commercial renovation and construction services for businesses",
    icon: "🏢",
  },
  {
    id: "handyman",
    name: "Handyman Services",
    description: "Professional repairs and maintenance for your home",
    icon: "🔧",
  },
  {
    id: "flooring",
    name: "Flooring Installation",
    description: "Beautiful and durable flooring solutions for every room",
    icon: "🪑",
  },
];

const Projects = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCategoryFromUrl = searchParams.get("category");

  const [categoryImages, setCategoryImages] = useState<
    Record<string, ImageFile[]>
  >({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(
    new Set()
  );
  const [currentModalIndex, setCurrentModalIndex] = useState<number>(0);

  // Initialize current image indexes for each category
  useEffect(() => {
    const initialIndexes: Record<string, number> = {};
    projectCategories.forEach((category) => {
      initialIndexes[category.id] = 0;
    });
    setCurrentImageIndexes(initialIndexes);
  }, []);

  // Create default images object
  const defaultImages: Record<string, ImageFile[]> = {
    kitchen: [
      {
        id: "kitchen-default",
        name: "Kitchen Default",
        url: kitchenDefault,
      },
    ],
    bathroom: [
      {
        id: "bathroom-default",
        name: "Bathroom Default",
        url: bathroomDefault,
      },
    ],
    exterior: [
      {
        id: "exterior-default",
        name: "Exterior Default",
        url: exteriorDefault,
      },
    ],
    commercial: [
      {
        id: "commercial-default",
        name: "Commercial Default",
        url: commercialDefault,
      },
    ],
    handyman: [
      {
        id: "handyman-default",
        name: "Handyman Default",
        url: handymanDefault,
      },
    ],
    flooring: [
      {
        id: "flooring-default",
        name: "Flooring Default",
        url: flooringDefault,
      },
    ],
  };

  // Preload images for faster rendering with better error handling
  const preloadImage = (url: string) => {
    if (preloadedImages.has(url)) return;

    const img = new Image();
    img.onload = () => {
      setPreloadedImages((prev) => new Set(prev).add(url));
    };
    img.onerror = () => {
      console.warn(`Failed to preload image: ${url}`);
    };
    img.src = url;
  };

  // Keep images in memory to prevent disappearing
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  // Cache loaded images
  const cacheImage = (url: string) => {
    if (!imageCache[url]) {
      setImageCache((prev) => ({ ...prev, [url]: url }));
    }
  };

  // Fetch images for each category
  useEffect(() => {
    const fetchCategoryImages = async () => {
      const newLoading: Record<string, boolean> = {};
      const newCategoryImages: Record<string, ImageFile[]> = {};

      // Initialize with default images
      projectCategories.forEach((category) => {
        newCategoryImages[category.id] = defaultImages[category.id] || [];
        newLoading[category.id] = false; // Set to false since we have default images
      });
      setCategoryImages(newCategoryImages);
      setLoading(newLoading);

      // Fetch images for each category and append to defaults
      for (const category of projectCategories) {
        try {
          const response = await fetch(
            import.meta.env.PROD
              ? `https://arsh-theta.vercel.app/api/gallery/${category.id}`
              : `/api/gallery/${category.id}`
          );

          if (response.ok) {
            const data = await response.json();
            const fetchedImages = data.images || [];
            console.log(
              `Fetched ${fetchedImages.length} images for ${category.name}:`,
              fetchedImages
            );

            // Combine default images with fetched images and sort by date
            const combinedImages = [
              ...defaultImages[category.id],
              ...fetchedImages,
            ];
            newCategoryImages[category.id] = sortImagesByDate(combinedImages);

            // Preload all images for this category
            fetchedImages.forEach((image) => {
              preloadImage(image.url);
              cacheImage(image.url);
            });
          } else {
            console.error(
              `Failed to fetch ${category.name} images:`,
              response.status
            );
          }
        } catch (error) {
          console.error(`Error fetching ${category.name} images:`, error);
          // Keep default images if fetch fails
        }
      }

      setCategoryImages(newCategoryImages);
      setLoading(newLoading);
    };

    fetchCategoryImages();
  }, []);

  // Handle URL parameter for category selection
  useEffect(() => {
    if (selectedCategoryFromUrl) {
      setSelectedCategory(selectedCategoryFromUrl);
    } else {
      setSelectedCategory(null);
    }
  }, [selectedCategoryFromUrl]);

  // Scroll to top when component mounts or when gallery opens
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory]);

  // Handle keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === "Escape") {
          setSelectedImage(null);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goToNextImage();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goToPreviousImage();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, selectedCategory, categoryImages]);

  // Navigation functions for modal
  const goToNextImage = () => {
    if (selectedCategory && selectedImage) {
      const images = categoryImages[selectedCategory] || [];
      const currentIndex = images.findIndex(
        (img) => img.id === selectedImage.id
      );
      if (currentIndex < images.length - 1) {
        setSelectedImage(images[currentIndex + 1]);
        setCurrentModalIndex(currentIndex + 1);
      }
    }
  };

  const goToPreviousImage = () => {
    if (selectedCategory && selectedImage) {
      const images = categoryImages[selectedCategory] || [];
      const currentIndex = images.findIndex(
        (img) => img.id === selectedImage.id
      );
      if (currentIndex > 0) {
        setSelectedImage(images[currentIndex - 1]);
        setCurrentModalIndex(currentIndex - 1);
      }
    }
  };

  // Handle image selection with index tracking
  const handleImageSelect = (image: ImageFile) => {
    if (selectedCategory) {
      const images = categoryImages[selectedCategory] || [];
      const index = images.findIndex((img) => img.id === image.id);
      setSelectedImage(image);
      setCurrentModalIndex(index);
    }
  };

  const handleViewProjects = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const closeGallery = () => {
    setSelectedCategory(null);
  };

  // Gallery view for selected category
  if (selectedCategory) {
    const category = projectCategories.find(
      (cat) => cat.id === selectedCategory
    );
    const images = categoryImages[selectedCategory] || [];
    const currentIndex = currentImageIndexes[selectedCategory] || 0;
    const isLoading = loading[selectedCategory];

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-8">
          {/* Back Navigation */}
          <div className="container-width mb-8">
            <Button variant="ghost" onClick={closeGallery} className="mb-4">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>

          {/* Gallery View */}
          <div className="container-width pb-24">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {category?.name} Gallery
              </h1>
              <p className="text-lg text-muted-foreground">
                {category?.description}
              </p>
            </div>

            {/* Image Gallery Grid */}
            <div className="max-w-6xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <span className="ml-3 text-muted-foreground">
                    Loading images from Google Drive...
                  </span>
                </div>
              ) : images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                      onClick={() => handleImageSelect(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className={`w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 ${
                          !preloadedImages.has(image.url)
                            ? "animate-pulse bg-gray-200"
                            : ""
                        }`}
                        onLoad={() => {
                          preloadImage(image.url);
                          cacheImage(image.url);
                        }}
                        onError={(e) => {
                          console.warn(`Failed to load image: ${image.url}`);
                          // Fallback to a placeholder or retry
                          e.currentTarget.style.display = "none";
                        }}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📷</div>
                  <p className="text-muted-foreground">
                    No images available for this category
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Image Modal/Lightbox */}
          {selectedImage && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-7xl max-h-full">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Navigation Buttons */}
                {selectedCategory && (
                  <>
                    {/* Previous Button */}
                    {currentModalIndex > 0 && (
                      <button
                        onClick={goToPreviousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                        aria-label="Previous image"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Next Button */}
                    {currentModalIndex <
                      (categoryImages[selectedCategory]?.length || 0) - 1 && (
                      <button
                        onClick={goToNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                        aria-label="Next image"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}

                {/* Image */}
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  onError={(e) => {
                    console.warn(
                      `Failed to load modal image: ${selectedImage.url}`
                    );
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Image Counter */}
                {selectedCategory && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                    {currentModalIndex + 1} of{" "}
                    {categoryImages[selectedCategory]?.length || 0}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-8">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-width text-center">
            <Badge variant="secondary" className="mb-4">
              Our Portfolio
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Project <span className="text-primary">Categories</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our diverse portfolio of renovation and construction
              projects. Each category showcases our expertise and commitment to
              quality craftsmanship.
            </p>
          </div>
        </section>

        {/* Project Categories */}
        <section className="section-padding pb-24">
          <div className="container-width">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectCategories.map((category) => {
                const images = categoryImages[category.id] || [];
                const currentIndex = currentImageIndexes[category.id] || 0;
                const isLoading = loading[category.id];

                return (
                  <Card
                    key={category.id}
                    id={`category-${category.id}`}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    {/* Default Image */}
                    <div className="relative h-64 bg-gray-100">
                      <img
                        src={defaultImages[category.id]?.[0]?.url}
                        alt={`${category.name} - Default`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Category Info */}
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{category.icon}</span>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProjects(category.id)}
                        >
                          View Projects
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-width text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contact us today for a free consultation and let's bring your
              vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => {
                  navigate("/#contact");
                  // Scroll to contact section after navigation
                  setTimeout(() => {
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }, 100);
                }}
              >
                Get Free Quote
              </Button>
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              >
                <a href="tel:929-386-3248" className="flex items-center">
                  Call (929) 386-3248
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;

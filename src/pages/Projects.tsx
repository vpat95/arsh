import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface ImageFile {
  id: string;
  name: string;
  url: string;
}

interface ProjectCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

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
  const selectedCategoryFromUrl = searchParams.get("category");

  const [categoryImages, setCategoryImages] = useState<
    Record<string, ImageFile[]>
  >({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Initialize current image indexes for each category
  useEffect(() => {
    const initialIndexes: Record<string, number> = {};
    projectCategories.forEach((category) => {
      initialIndexes[category.id] = 0;
    });
    setCurrentImageIndexes(initialIndexes);
  }, []);

  // Fetch images for each category
  useEffect(() => {
    const fetchCategoryImages = async () => {
      const newLoading: Record<string, boolean> = {};
      const newCategoryImages: Record<string, ImageFile[]> = {};

      // Set all categories to loading
      projectCategories.forEach((category) => {
        newLoading[category.id] = true;
      });
      setLoading(newLoading);

      // Fetch images for each category
      for (const category of projectCategories) {
        try {
          const response = await fetch(
            import.meta.env.PROD
              ? `https://arsh-theta.vercel.app/api/gallery/${category.id}`
              : `/api/gallery/${category.id}`
          );

          if (response.ok) {
            const data = await response.json();
            newCategoryImages[category.id] = data.images || [];
          } else {
            newCategoryImages[category.id] = [];
          }
        } catch (error) {
          console.error(`Error fetching ${category.name} images:`, error);
          newCategoryImages[category.id] = [];
        } finally {
          newLoading[category.id] = false;
        }
      }

      setCategoryImages(newCategoryImages);
      setLoading(newLoading);
    };

    fetchCategoryImages();
  }, []);

  // Auto-rotate carousels
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    projectCategories.forEach((category) => {
      const images = categoryImages[category.id] || [];
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndexes((prev) => ({
            ...prev,
            [category.id]: (prev[category.id] + 1) % images.length,
          }));
        }, 4000); // 4 seconds per image
        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [categoryImages]);

  // Handle URL parameter for category selection
  useEffect(() => {
    if (selectedCategoryFromUrl) {
      setSelectedCategory(selectedCategoryFromUrl);
    } else {
      setSelectedCategory(null);
    }
  }, [selectedCategoryFromUrl]);

  const nextImage = (categoryId: string) => {
    const images = categoryImages[categoryId] || [];
    if (images.length > 1) {
      setCurrentImageIndexes((prev) => ({
        ...prev,
        [categoryId]: (prev[categoryId] + 1) % images.length,
      }));
    }
  };

  const prevImage = (categoryId: string) => {
    const images = categoryImages[categoryId] || [];
    if (images.length > 1) {
      setCurrentImageIndexes((prev) => ({
        ...prev,
        [categoryId]:
          prev[categoryId] === 0 ? images.length - 1 : prev[categoryId] - 1,
      }));
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
          <div className="container-width">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {category?.name} Gallery
              </h1>
              <p className="text-lg text-muted-foreground">
                {category?.description}
              </p>
            </div>

            {/* Image Gallery */}
            <div className="max-w-4xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <span className="ml-3 text-muted-foreground">
                    Loading images...
                  </span>
                </div>
              ) : images.length > 0 ? (
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={images[currentIndex]?.url}
                      alt={`${category?.name} - ${images[currentIndex]?.name}`}
                      className="w-full h-96 object-cover"
                    />

                    {/* Navigation Controls */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(selectedCategory)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => nextImage(selectedCategory)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                          {currentIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Grid */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() =>
                            setCurrentImageIndexes((prev) => ({
                              ...prev,
                              [selectedCategory]: index,
                            }))
                          }
                          className={`relative rounded overflow-hidden transition-opacity ${
                            index === currentIndex
                              ? "opacity-100 ring-2 ring-primary"
                              : "opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
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
        <section className="section-padding">
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
                    {/* Image Carousel */}
                    <div className="relative h-64 bg-gray-100">
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-muted-foreground">
                              Loading...
                            </span>
                          </div>
                        </div>
                      ) : images.length > 0 ? (
                        <>
                          {/* Main Image */}
                          <img
                            src={images[currentIndex]?.url}
                            alt={`${category.name} - ${images[currentIndex]?.name}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Carousel Controls */}
                          {images.length > 1 && (
                            <>
                              {/* Previous Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  prevImage(category.id);
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>

                              {/* Next Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextImage(category.id);
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>

                              {/* Image Counter */}
                              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                {currentIndex + 1} / {images.length}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <div className="text-4xl">{category.icon}</div>
                            <p className="text-muted-foreground text-sm">
                              No images available
                            </p>
                          </div>
                        </div>
                      )}
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
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">
                          {images.length} project
                          {images.length !== 1 ? "s" : ""}
                        </Badge>
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
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Link to="/#contact">Get Free Quote</Link>
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

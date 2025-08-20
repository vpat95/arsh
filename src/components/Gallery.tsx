import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageFile {
  id: string;
  name: string;
  url: string;
  category?: string;
}

const categories = [
  { id: "all", label: "All Projects" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bathroom", label: "Bathroom" },
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "handyman", label: "Handyman" },
  { id: "flooring", label: "Flooring" },
  { id: "commercial", label: "Commercial" },
];

const Gallery = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchGallery = async (category: string = "all") => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        import.meta.env.PROD
          ? `https://arsh-modernize-build-rni8wukwx-vpat95s-projects.vercel.app/api/gallery/${category}`
          : `/api/gallery/${category}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setImages(data.images || []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
      setError(err instanceof Error ? err.message : "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <section className="section-padding bg-contractor-gray-light/30">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">Our Work</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Project Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through our completed renovation and construction projects
            </p>
          </div>

          <div className="flex justify-center items-center py-16">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading gallery...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-contractor-gray-light/30">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">Our Work</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Project Gallery
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through our completed renovation and construction projects
            </p>
          </div>

          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Unable to load gallery</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-contractor-gray-light/30">
      <div className="container-width">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Our Work</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Project Gallery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our completed renovation and construction projects
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
            <TabsList className="grid w-full max-w-md grid-cols-3 lg:grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {images.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No images available</p>
              <p className="text-sm text-muted-foreground">
                Check back soon for our latest{" "}
                {selectedCategory !== "all" ? selectedCategory : ""} projects
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2">
                        {image.name.replace(/\.[^/.]+$/, "")}{" "}
                        {/* Remove file extension */}
                      </h3>
                      {image.category && image.category !== "all" && (
                        <Badge variant="outline" className="mt-2">
                          {image.category}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                {images.length} project{images.length !== 1 ? "s" : ""} shown
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Gallery;

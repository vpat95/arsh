import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageFile {
  id: string;
  name: string;
  url: string;
}

const HomepageGallery = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          import.meta.env.PROD
            ? "https://arsh-theta.vercel.app/api/gallery/home"
            : "/api/gallery/home"
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        console.log("Frontend received data:", data);
        console.log("Images array:", data.images);
        setImages(data.images || []);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError(err instanceof Error ? err.message : "Failed to load gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-contractor-gray-light/30">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">Featured Work</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Our Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a look at some of our recent renovation and construction
              projects
            </p>
          </div>

          <div className="flex justify-center items-center py-16">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Loading projects...</span>
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
            <Badge variant="secondary">Featured Work</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Our Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a look at some of our recent renovation and construction
              projects
            </p>
          </div>

          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Unable to load projects</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="section-padding bg-contractor-gray-light/30">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">Featured Work</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Our Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a look at some of our recent renovation and construction
              projects
            </p>
          </div>

          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No projects available</p>
              <p className="text-sm text-muted-foreground">
                Check back soon for our latest projects
              </p>
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
          <Badge variant="secondary">Featured Work</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Our Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a look at some of our recent renovation and construction
            projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.slice(0, 6).map((image) => (
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
                    {image.name.replace(/\.[^/.]+$/, "")}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/projects"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomepageGallery;

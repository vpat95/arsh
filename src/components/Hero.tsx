import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageFile {
  id: string;
  name: string;
  url: string;
}

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from Google Drive
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        setLoading(true);
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

        setImages(data.images || []);
      } catch (err) {
        console.error("Error fetching hero images:", err);
        // Fallback to empty array if API fails
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative section-padding bg-gradient-to-br from-contractor-gold-light/20 to-background overflow-hidden">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-contractor-gold-light rounded-full text-sm font-medium text-contractor-gold">
                🏗️ New Jersey's Top Contractor
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Transforming Your
                <span className="text-primary block">Home Dreams</span>
                Into Reality
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Professional renovation and remodeling services in Bergen
                County. From kitchens to complete home makeovers, we deliver
                exceptional quality with every project.
              </p>
            </div>

            {/* Key Points */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-contractor-gold" />
                <span>Free Estimates</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-contractor-gold" />
                <span>Fully Insured & Bonded</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-contractor-gold" />
                <span>20+ Years Experience</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="secondary"
                size="xl"
                className="contractor-button-shadow"
              >
                Get Free Estimate
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                <Phone className="w-5 h-5" />
                Call Now: 929-386-3248
              </Button>
            </div>
          </div>

          {/* Hero Image Carousel */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden contractor-card-gradient p-1">
              <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-muted-foreground">
                        Loading images...
                      </span>
                    </div>
                  </div>
                ) : images.length > 0 ? (
                  <>
                    {images.map((image, index) => (
                      <img
                        key={image.id}
                        src={image.url}
                        alt={`Professional home renovation and construction work - ${image.name}`}
                        className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-1000 ${
                          index === currentImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    ))}

                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏗️</span>
                      </div>
                      <p className="text-muted-foreground">
                        No images available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5★</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

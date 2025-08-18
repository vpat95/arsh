import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

// Types for Google Reviews data
interface GoogleReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  url: string;
}

const GoogleReviews = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [placeDetails, setPlaceDetails] = useState<GooglePlaceDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get these from environment variables or replace with your actual values
  // See GOOGLE_REVIEWS_SETUP.md for detailed setup instructions
  const PLACE_ID =
    import.meta.env?.VITE_GOOGLE_PLACE_ID || "YOUR_GOOGLE_PLACE_ID_HERE";
  const API_KEY = import.meta.env?.VITE_GOOGLE_PLACES_API_KEY;

  useEffect(() => {
    fetchGoogleReviews();
  }, []);

  const loadDemoReviews = () => {
    // Demo data to show while setting up actual Google Reviews
    const demoReviews: GoogleReview[] = [
      {
        author_name: "John D.",
        rating: 5,
        relative_time_description: "2 weeks ago",
        text: "Outstanding work on our kitchen remodel! The team was professional, punctual, and delivered exactly what we envisioned. Highly recommend Arsh Consultancy & Contractors!",
        time: Date.now() / 1000 - 1209600,
        language: "en",
        profile_photo_url:
          "https://ui-avatars.com/api/?name=John+D&background=0052cc&color=fff",
      },
      {
        author_name: "Sarah M.",
        rating: 5,
        relative_time_description: "1 month ago",
        text: "Incredible bathroom renovation! From design to completion, everything was handled with care and expertise. The quality of work exceeded our expectations.",
        time: Date.now() / 1000 - 2592000,
        language: "en",
        profile_photo_url:
          "https://ui-avatars.com/api/?name=Sarah+M&background=ff6b35&color=fff",
      },
      {
        author_name: "Mike R.",
        rating: 5,
        relative_time_description: "3 weeks ago",
        text: "Best contractors in Bergen County! They transformed our basement into a beautiful living space. Professional, reliable, and fair pricing.",
        time: Date.now() / 1000 - 1814400,
        language: "en",
        profile_photo_url:
          "https://ui-avatars.com/api/?name=Mike+R&background=28a745&color=fff",
      },
    ];

    const demoPlaceDetails: GooglePlaceDetails = {
      name: "Arsh Consultancy & Contractors",
      rating: 4.9,
      user_ratings_total: 47,
      reviews: demoReviews,
      url: getGoogleReviewsUrl("Arsh Consultancy & Contractors"),
    };

    setPlaceDetails(demoPlaceDetails);
    setReviews(demoReviews);
    setLoading(false);
  };

  const fetchGoogleReviews = async () => {
    if (!API_KEY || PLACE_ID === "YOUR_GOOGLE_PLACE_ID_HERE") {
      // Show demo reviews when not configured
      loadDemoReviews();
      return;
    }

    try {
      // Note: In a production app, you should make this request through your backend
      // to avoid exposing your API key on the client side
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total,url&key=${API_KEY}`,
        {
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      if (data.status === "OK" && data.result) {
        // Update the URL to point to reviews instead of maps
        const updatedResult = {
          ...data.result,
          url: getGoogleReviewsUrl(data.result.name, PLACE_ID),
        };
        setPlaceDetails(updatedResult);
        setReviews(data.result.reviews || []);
      } else {
        throw new Error(data.status || "Unknown error");
      }
    } catch (err) {
      console.error("Error fetching Google reviews:", err);
      setError("Unable to load reviews at this time.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Generate Google Reviews URL (not Google Maps)
  const getGoogleReviewsUrl = (businessName: string, placeId?: string) => {
    if (placeId && placeId !== "YOUR_GOOGLE_PLACE_ID_HERE") {
      // If we have a Place ID, use it for more accurate results
      return `https://search.google.com/local/reviews?placeid=${placeId}`;
    } else {
      // Fallback to search with reviews filter
      const encodedName = encodeURIComponent(businessName);
      return `https://www.google.com/search?q=${encodedName}+reviews#lrd=0x0:0x0,1`;
    }
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">What Our Clients Say</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Customer Reviews
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="contractor-card-gradient border-0 animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding">
        <div className="container-width">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary">What Our Clients Say</Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Customer Reviews
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-yellow-800 mb-4">
                <strong>Demo Mode:</strong> Showing sample reviews. {error}
              </p>
              <p className="text-sm text-gray-600">
                See <code>GOOGLE_REVIEWS_SETUP.md</code> for instructions to
                display real Google reviews.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-width">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">What Our Clients Say</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Customer Reviews
          </h2>
          {(!API_KEY || PLACE_ID === "YOUR_GOOGLE_PLACE_ID_HERE") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto text-sm">
              <p className="text-blue-800">
                <strong>Demo Mode:</strong> Showing sample reviews. Configure
                your Google Places API to display real reviews. See{" "}
                <code>GOOGLE_REVIEWS_SETUP.md</code> for setup instructions.
              </p>
            </div>
          )}
          {placeDetails && (
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(Math.round(placeDetails.rating))}
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {placeDetails.rating}
                </span>
              </div>
              <span className="text-muted-foreground">
                Based on {placeDetails.user_ratings_total} reviews
              </span>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={placeDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  View on Google <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, index) => (
              <Card
                key={index}
                className="contractor-card-gradient border-0 hover:scale-105 transition-all duration-300"
              >
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-contractor-orange mb-4" />

                  {/* Review Text */}
                  <p
                    className="text-muted-foreground mb-6 flex-grow overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical" as const,
                    }}
                  >
                    {truncateText(review.text)}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="font-medium">{review.rating}/5</span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          review.author_name
                        )}&background=0052cc&color=fff`;
                      }}
                    />
                    <div>
                      <div className="font-medium text-foreground">
                        {review.author_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {review.relative_time_description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No reviews available at this time.
            </p>
          </div>
        )}

        {/* CTA */}
        {placeDetails && (
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <a
                href={placeDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Read All Reviews on Google{" "}
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleReviews;

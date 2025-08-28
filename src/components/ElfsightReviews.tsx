import { useEffect, useState } from "react";

const ElfsightReviews = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://elfsightcdn.com/platform.js"]'
    );

    if (existingScript) {
      // Script already exists, just show the widget
      setIsLoading(false);
      return;
    }

    // Load the Elfsight platform script with higher priority
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = false; // Changed to false for faster loading
    script.defer = false; // Ensure immediate execution

    // Add script to head with higher priority
    const firstScript = document.head.querySelector("script");
    if (firstScript) {
      document.head.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }

    // Listen for script load completion
    script.onload = () => {
      setIsLoading(false);
      // Dispatch custom event when Elfsight widget is loaded
      window.dispatchEvent(new CustomEvent("elfsightWidgetLoaded"));
    };

    script.onerror = () => {
      console.error("Failed to load Elfsight script");
      setIsLoading(false);
      setHasError(true);
    };

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Elfsight script loading timeout");
        setIsLoading(false);
        setHasError(true);
      }
    }, 10000); // 10 second timeout

    return () => {
      clearTimeout(timeout);
      const scriptToRemove = document.querySelector(
        'script[src="https://elfsightcdn.com/platform.js"]'
      );
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, []);

  return (
    <section className="pt-16 pb-24 bg-contractor-gray-light/30">
      <div className="container-width">
        {/* Loading State */}
        {isLoading && !hasError && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading reviews...
            </span>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Customer Reviews
                </h3>
                <p className="text-muted-foreground">
                  Check out our 5-star reviews on Google!
                </p>
              </div>
              <a
                href="https://www.google.com/search?q=Arsh+Consultancy+%26+Contractors+Inc+reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Reviews on Google
              </a>
            </div>
          </div>
        )}

        {/* Elfsight Google Reviews Widget */}
        {!hasError && (
          <div
            className={`elfsight-app-ff572c65-3037-4b9a-8aac-b135cb9612ca ${
              isLoading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500`}
            data-elfsight-app-lazy={!isLoading}
          />
        )}
      </div>
    </section>
  );
};

export default ElfsightReviews;

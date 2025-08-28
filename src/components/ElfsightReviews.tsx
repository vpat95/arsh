import { useEffect, useState } from "react";

const ElfsightReviews = () => {
  const [isLoading, setIsLoading] = useState(true);

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
    };

    // Cleanup function to remove script when component unmounts
    return () => {
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
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading reviews...
            </span>
          </div>
        )}

        {/* Elfsight Google Reviews Widget */}
        <div
          className={`elfsight-app-ff572c65-3037-4b9a-8aac-b135cb9612ca ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
          data-elfsight-app-lazy={!isLoading}
        />
      </div>
    </section>
  );
};

export default ElfsightReviews;

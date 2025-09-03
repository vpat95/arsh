import { useEffect } from "react";

const ElfsightReviews = () => {
  useEffect(() => {
    // Load the Elfsight platform script exactly as provided
    const script = document.createElement("script");
    script.src = "https://elfsightcdn.com/platform.js";
    script.async = true;

    // Add to head as recommended
    document.head.appendChild(script);
  }, []);

  return (
    <section className="pt-16 pb-24 bg-contractor-gray-light/30">
      <div className="container-width">
        {/* Elfsight Google Reviews Widget - Official Installation */}
        <div
          className="elfsight-app-ff572c65-3037-4b9a-8aac-b135cb9612ca"
          data-elfsight-app-lazy
          style={{
            minHeight: "400px",
            width: "100%",
          }}
        />
      </div>
    </section>
  );
};

export default ElfsightReviews;

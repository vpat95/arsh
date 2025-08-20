import bathroomImage from "@/assets/bathroom-remodel.jpg";
import exteriorImage from "@/assets/exterior-work.jpg";
import kitchenImage from "@/assets/kitchen-remodel.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Kitchen Remodeling",
    description:
      "Complete kitchen transformations with modern designs, quality cabinets, and professional installation.",
    image: kitchenImage,
    features: [
      "Custom Cabinetry",
      "Countertop Installation",
      "Appliance Integration",
      "Modern Lighting",
    ],
  },
  {
    title: "Bathroom Renovation",
    description:
      "Luxurious bathroom makeovers featuring contemporary fixtures and elegant tile work.",
    image: bathroomImage,
    features: [
      "Tile Installation",
      "Modern Fixtures",
      "Shower & Tub",
      "Vanity Solutions",
    ],
  },
  {
    title: "Exterior Work",
    description:
      "Enhance your home's curb appeal with professional siding, roofing, and exterior improvements.",
    image: exteriorImage,
    features: [
      "Siding Installation",
      "Roofing Services",
      "Windows & Doors",
      "Deck Construction",
    ],
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="section-padding bg-contractor-gray-light/30 smooth-scroll-target"
    >
      <div className="container-width">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Professional Contracting Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We provide creative remodeling services for your bathroom, kitchen,
            and complete home transformations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="contractor-card-gradient border-0 hover:scale-105 transition-all duration-300 group"
            >
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <ul className="space-y-1 text-sm">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-contractor-gold rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="w-full group/btn">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="secondary" size="xl">
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;

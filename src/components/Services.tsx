import { Card, CardContent } from "@/components/ui/card";
import {
  Bath,
  Sparkles as Chandelier,
  ChefHat,
  DoorOpen,
  Droplets,
  Fence,
  Hammer,
  Home,
  Lightbulb,
  Paintbrush,
  Palette,
  Settings,
  Square,
  Tv,
  Wrench,
  Zap,
} from "lucide-react";

const services = [
  {
    id: "interior",
    category: "Interior Services",
    icon: Home,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    services: [
      { name: "Drywall / Plaster / Spackling", icon: Square },
      { name: "Painting", icon: Paintbrush },
      { name: "Framing", icon: Hammer },
      { name: "Doors (Interior & Exterior)", icon: DoorOpen },
      { name: "Flooring", icon: Square },
      { name: "Tiles", icon: Square },
      { name: "Bathroom Renovations", icon: Bath },
      { name: "Kitchen Renovations", icon: ChefHat },
      { name: "Kitchen Cabinet Resurfacing", icon: ChefHat },
    ],
  },
  {
    id: "exterior",
    category: "Exterior Services",
    icon: Home,
    color: "text-green-600",
    bgColor: "bg-green-50",
    services: [
      { name: "Windows", icon: Square },
      { name: "Sidewalks", icon: Square },
      { name: "Brick Grinding & Pointing", icon: Paintbrush },
      { name: "Stucco", icon: Palette },
      { name: "Angle Line Change", icon: Wrench },
      { name: "Doors (Interior or Exterior)", icon: DoorOpen },
      { name: "Spray Painting", icon: Paintbrush },
      { name: "Fencing", icon: Fence },
      { name: "Powerwashing / Brick Lime Washing", icon: Droplets },
      { name: "Roof Repairs", icon: Home },
      { name: "Chimney Repair", icon: Home },
      { name: "Stone Replacements", icon: Square },
      { name: "Steps Repair", icon: Square },
      { name: "Awnings", icon: Square },
    ],
  },
  {
    id: "handyman",
    category: "Handyman Services",
    icon: Wrench,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    services: [
      { name: "Plumbing", icon: Droplets },
      { name: "Electrical", icon: Zap },
      { name: "Light Fixtures", icon: Lightbulb },
      { name: "Fix-up Jobs", icon: Settings },
      { name: "TV Mounting", icon: Tv },
      { name: "Chandelier Hanging", icon: Chandelier },
      { name: "Any Small Jobs Around the House", icon: Wrench },
    ],
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="pt-16 pb-16 bg-muted/30 smooth-scroll-target"
    >
      <div className="container-width">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Professional <span className="text-primary">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From interior renovations to exterior improvements and handyman
            services, we provide comprehensive solutions for all your home
            improvement needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {services.map((category, categoryIndex) => (
            <Card
              key={categoryIndex}
              className="contractor-card-gradient border-0 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                {/* Category Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center`}
                  >
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {category.category}
                  </h3>
                </div>

                {/* Services List */}
                <div className="grid grid-cols-1 gap-2">
                  {category.services.map((service, serviceIndex) => (
                    <div
                      key={serviceIndex}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-background/50 transition-colors"
                    >
                      <service.icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs font-medium text-foreground">
                        {service.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

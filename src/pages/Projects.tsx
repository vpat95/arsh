import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  MapPin,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Import existing images
import bathroomImage from "@/assets/bathroom-remodel.jpg";
import exteriorImage from "@/assets/exterior-work.jpg";
import heroImage from "@/assets/hero-construction.jpg";
import kitchenImage from "@/assets/kitchen-remodel.jpg";

// Sample project data - in a real app, this would come from a CMS or API
const projects = [
  {
    id: 1,
    title: "Modern Kitchen Transformation",
    category: "Kitchen",
    location: "Bergen County, NJ",
    duration: "6 weeks",
    budget: "$45,000",
    client: "The Johnson Family",
    description:
      "Complete kitchen renovation featuring custom cabinets, quartz countertops, and modern appliances. This project transformed a dated 1980s kitchen into a contemporary culinary space.",
    beforeImage: kitchenImage, // We'll use the same image for now
    afterImage: kitchenImage,
    featured: true,
    completedDate: "2024-01-15",
    services: [
      "Custom Cabinetry",
      "Countertop Installation",
      "Appliance Integration",
      "Electrical Work",
      "Plumbing",
    ],
    testimonial:
      "Arsh and his team exceeded our expectations. The attention to detail and quality of work is outstanding.",
    beforeDescription: "Outdated kitchen with old cabinets and limited storage",
    afterDescription:
      "Modern, functional kitchen with custom storage solutions",
  },
  {
    id: 2,
    title: "Luxury Bathroom Renovation",
    category: "Bathroom",
    location: "Hackensack, NJ",
    duration: "4 weeks",
    budget: "$28,000",
    client: "The Smith Residence",
    description:
      "Master bathroom renovation with walk-in shower, double vanity, and premium tile work. Features heated floors and smart fixtures.",
    beforeImage: bathroomImage,
    afterImage: bathroomImage,
    featured: true,
    completedDate: "2024-02-28",
    services: [
      "Tile Installation",
      "Plumbing",
      "Electrical",
      "Waterproofing",
      "Custom Vanity",
    ],
    testimonial:
      "The bathroom looks absolutely stunning. Professional work from start to finish.",
    beforeDescription: "Small, cramped bathroom with outdated fixtures",
    afterDescription: "Spacious luxury bathroom with modern amenities",
  },
  {
    id: 3,
    title: "Complete Home Exterior Makeover",
    category: "Exterior",
    location: "Teaneck, NJ",
    duration: "8 weeks",
    budget: "$62,000",
    client: "The Williams Family",
    description:
      "Full exterior renovation including new siding, roofing, windows, and front porch construction. Dramatically improved curb appeal.",
    beforeImage: exteriorImage,
    afterImage: exteriorImage,
    featured: false,
    completedDate: "2023-11-20",
    services: [
      "Siding Installation",
      "Roofing",
      "Window Replacement",
      "Porch Construction",
      "Landscaping",
    ],
    testimonial:
      "Our home looks brand new! The crew was professional and the work quality is exceptional.",
    beforeDescription: "Aging exterior with worn siding and roof",
    afterDescription: "Beautiful modern exterior with enhanced curb appeal",
  },
  {
    id: 4,
    title: "Basement Finishing Project",
    category: "Basement",
    location: "Paramus, NJ",
    duration: "5 weeks",
    budget: "$35,000",
    client: "The Garcia Family",
    description:
      "Complete basement transformation into a family entertainment space with bar area, home theater, and guest bedroom.",
    beforeImage: heroImage,
    afterImage: heroImage,
    featured: false,
    completedDate: "2023-12-10",
    services: [
      "Framing",
      "Electrical",
      "Flooring",
      "Bar Construction",
      "Home Theater Setup",
    ],
    testimonial:
      "Amazing transformation! Our basement is now our favorite room in the house.",
    beforeDescription: "Unfinished basement with concrete floors",
    afterDescription: "Luxurious entertainment space with bar and theater",
  },
  {
    id: 5,
    title: "Open Concept Living Space",
    category: "Interior",
    location: "Englewood, NJ",
    duration: "7 weeks",
    budget: "$52,000",
    client: "The Martinez Family",
    description:
      "Removed walls to create an open concept living space, updated flooring throughout, and modernized lighting.",
    beforeImage: heroImage,
    afterImage: heroImage,
    featured: true,
    completedDate: "2024-03-15",
    services: [
      "Wall Removal",
      "Structural Work",
      "Flooring",
      "Electrical",
      "Painting",
    ],
    testimonial:
      "The open floor plan has completely changed how we live in our home. Excellent work!",
    beforeDescription: "Closed-off rooms with outdated finishes",
    afterDescription: "Bright, open living space perfect for entertaining",
  },
  {
    id: 6,
    title: "Master Suite Addition",
    category: "Addition",
    location: "Fort Lee, NJ",
    duration: "12 weeks",
    budget: "$85,000",
    client: "The Chen Family",
    description:
      "Added a new master suite with walk-in closet and ensuite bathroom. Includes structural work and full integration with existing home.",
    beforeImage: exteriorImage,
    afterImage: exteriorImage,
    featured: false,
    completedDate: "2023-10-05",
    services: [
      "Structural Addition",
      "Roofing Extension",
      "Plumbing",
      "Electrical",
      "HVAC",
    ],
    testimonial:
      "The addition looks like it was always part of our home. Exceptional craftsmanship.",
    beforeDescription: "Limited bedroom space with small closets",
    afterDescription: "Spacious master suite with luxury amenities",
  },
];

const categories = [
  "All",
  "Kitchen",
  "Bathroom",
  "Exterior",
  "Basement",
  "Interior",
  "Addition",
];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const featuredProjects = projects.filter((project) => project.featured);

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-8">
          {/* Back Navigation */}
          <div className="container-width mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedProject(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>

          {/* Project Detail */}
          <div className="container-width">
            <div className="grid lg:grid-cols-2 gap-12 mb-12">
              {/* Project Images */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Before</h3>
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={selectedProject.beforeImage}
                      alt={`${selectedProject.title} - Before`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedProject.beforeDescription}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">After</h3>
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={selectedProject.afterImage}
                      alt={`${selectedProject.title} - After`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedProject.afterDescription}
                  </p>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-4">
                    {selectedProject.category}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-4">
                    {selectedProject.title}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Project Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Client</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.client}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Investment</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.budget}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="font-semibold mb-3">Services Provided</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.services.map((service, index) => (
                      <Badge key={index} variant="outline">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">Client Testimonial</h3>
                  <blockquote className="text-muted-foreground italic">
                    "{selectedProject.testimonial}"
                  </blockquote>
                  <p className="text-sm font-medium mt-2">
                    - {selectedProject.client}
                  </p>
                </div>
              </div>
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
              Recent <span className="text-primary">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore our portfolio of successful home renovations and
              remodeling projects. Each project showcases our commitment to
              quality craftsmanship and customer satisfaction.
            </p>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="section-padding bg-muted/30">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative">
                    <img
                      src={project.afterImage}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-4 left-4">Featured</Badge>
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{project.location}</span>
                      <span>{project.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* All Projects */}
        <section className="section-padding">
          <div className="container-width">
            <h2 className="text-3xl font-bold mb-8">All Projects</h2>

            {/* Category Filter */}
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="mb-8"
            >
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="text-xs lg:text-sm"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative">
                    <img
                      src={project.afterImage}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                    {project.featured && (
                      <Badge className="absolute top-4 left-4">Featured</Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-2">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex justify-between text-sm text-muted-foreground mb-3">
                      <span>{project.location}</span>
                      <span>{project.duration}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
              <Button asChild size="lg" variant="secondary">
                <Link to="/#contact">Get Free Quote</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/#contact" className="flex items-center">
                  Call (929) 386-3248
                </Link>
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

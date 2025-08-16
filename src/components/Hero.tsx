import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";

const Hero = () => {
  return (
    <section className="relative section-padding bg-gradient-to-br from-contractor-blue-light/20 to-background overflow-hidden">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-contractor-orange-light rounded-full text-sm font-medium text-contractor-orange">
                🏗️ New Jersey's Top Contractor
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Transforming Your 
                <span className="text-primary block">Home Dreams</span>
                Into Reality
              </h1>
              <p className="text-xl text-muted-foreground text-balance">
                Professional renovation and remodeling services in Bergen County. 
                From kitchens to complete home makeovers, we deliver exceptional quality with every project.
              </p>
            </div>

            {/* Key Points */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-contractor-orange" />
                <span>Free Estimates</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-contractor-orange" />
                <span>Fully Insured & Bonded</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-contractor-orange" />
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

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden contractor-card-gradient p-1">
              <img
                src={heroImage}
                alt="Professional home renovation and construction work"
                className="w-full h-[500px] object-cover rounded-xl"
              />
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
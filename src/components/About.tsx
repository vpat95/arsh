import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Shield, Clock } from "lucide-react";

const stats = [
  { icon: Users, label: "Happy Clients", value: "200+", color: "text-contractor-blue" },
  { icon: Award, label: "Years Experience", value: "20+", color: "text-contractor-orange" },
  { icon: Shield, label: "Insured & Bonded", value: "100%", color: "text-contractor-blue" },
  { icon: Clock, label: "On-Time Delivery", value: "98%", color: "text-contractor-orange" },
];

const About = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                About Arsh Consultancy & Contractors
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
                Pursuing Excellence & Quality in Every Project
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg">
                  Arsh Consultancy & Contractors Inc. is the best company in New Jersey for all of your home remodeling needs. Our areas of expertise include high-quality flooring, interior and exterior painting, basement finishing, kitchen and bathroom remodeling, and more.
                </p>
                <p>
                  We aim for top-notch craftsmanship and exceptional customer service. When quality and price are the most important factors to you, we are just a phone call away!
                </p>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">What Sets Us Apart</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-contractor-orange rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-foreground">Free Estimates</div>
                    <div className="text-muted-foreground">Complete in-home consultations at no cost</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-contractor-orange rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-foreground">Fully Insured Team</div>
                    <div className="text-muted-foreground">All contractors are insured and bonded</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-contractor-orange rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-foreground">Professional Crew</div>
                    <div className="text-muted-foreground">Clean, courteous, and experienced team</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-contractor-orange rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-foreground">Proven Experience</div>
                    <div className="text-muted-foreground">Years of expertise in home improvement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="contractor-card-gradient border-0 hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br from-contractor-blue-light to-contractor-orange-light flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
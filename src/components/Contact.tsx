import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Facebook, Instagram, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <section
      id="contact"
      className="section-padding bg-contractor-gray-light/30 smooth-scroll-target"
    >
      <div className="container-width">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Ready to Transform Your Home?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch today for your free estimate. We're here to make your
            renovation dreams come true.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="contractor-card-gradient border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Get Your Free Estimate
              </h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      First Name
                    </label>
                    <Input placeholder="John" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Last Name
                    </label>
                    <Input placeholder="Smith" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Email
                  </label>
                  <Input type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Phone
                  </label>
                  <Input type="tel" placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Project Details
                  </label>
                  <Textarea
                    placeholder="Tell us about your renovation project..."
                    className="min-h-32"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full contractor-button-shadow"
                >
                  Request Free Estimate
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="contractor-card-gradient border-0">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Get In Touch
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 contractor-gradient-bg rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Phone</div>
                      <div className="text-muted-foreground">929-386-3248</div>
                      <div className="text-sm text-muted-foreground">
                        Call us anytime
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 contractor-gradient-bg rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        Service Area
                      </div>
                      <div className="text-muted-foreground">
                        Bergen County, NJ
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Fair Lawn and surrounding areas
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 contractor-gradient-bg rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        Business Hours
                      </div>
                      <div className="text-muted-foreground">
                        Mon - Fri: 8AM - 6PM
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Weekend consultations available
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links & CTA */}
            <Card className="contractor-card-gradient border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Follow Our Work
                </h3>
                <div className="flex justify-center space-x-4 mb-6">
                  <Button variant="outline" size="icon">
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Instagram className="w-5 h-5" />
                  </Button>
                </div>
                <Button variant="professional" size="xl" className="w-full">
                  <Phone className="w-5 h-5" />
                  Call Now for Immediate Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

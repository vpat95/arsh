import { Facebook, Instagram, Phone, MapPin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-width section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Arsh Consultancy & Contractors</h3>
                <p className="text-primary-foreground/80 text-sm">Professional Renovation Services</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 max-w-md">
              Transforming homes across Bergen County with professional renovation and remodeling services. 
              Quality craftsmanship, reliable service, and customer satisfaction guaranteed.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Kitchen Remodeling</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Bathroom Renovation</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Exterior Work</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Interior Painting</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Basement Finishing</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Info</h4>
            <div className="space-y-3 text-primary-foreground/80">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>929-386-3248</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Bergen County, NJ</span>
              </div>
              <div className="text-sm">
                <div>Mon - Fri: 8AM - 6PM</div>
                <div>Weekend consultations available</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-primary-foreground/60 text-sm">
              © 2024 Arsh Consultancy & Contractors Inc. All rights reserved.
            </div>
            <div className="flex space-x-6 text-primary-foreground/60 text-sm">
              <a href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
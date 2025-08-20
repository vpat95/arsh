import arshLogo from "@/assets/arsh_logo.webp";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container-width section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <img
                  src={arshLogo}
                  alt="Arsh Consultancy & Contractors Logo"
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <p className="text-gray-300 max-w-md">
              Transforming homes across Bergen County with professional
              renovation and remodeling services. Quality craftsmanship,
              reliable service, and customer satisfaction guaranteed.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-contractor-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-contractor-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a
                  href="#"
                  className="hover:text-contractor-gold transition-colors"
                >
                  Kitchen Remodeling
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-contractor-gold transition-colors"
                >
                  Bathroom Renovation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-contractor-gold transition-colors"
                >
                  Exterior Work
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-contractor-gold transition-colors"
                >
                  Interior Painting
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-contractor-gold transition-colors"
                >
                  Basement Finishing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
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

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Arsh Consultancy & Contractors Inc. All rights reserved.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a
                href="#"
                className="hover:text-contractor-gold transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-contractor-gold transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

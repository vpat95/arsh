import arshLogo from "@/assets/arsh_logo.webp";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

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
              Transforming homes across North and Central Jersey with
              professional renovation and remodeling services. Quality
              craftsmanship, reliable service, and customer satisfaction
              guaranteed.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/kusharsh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:text-[#166FE5] hover:scale-110 transition-all duration-200"
              >
                <Facebook className="w-7 h-7" />
              </a>
              <a
                href="https://www.instagram.com/arsh.c.contractors.inc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E4405F] hover:text-[#D63384] hover:scale-110 transition-all duration-200"
              >
                <Instagram className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  to="/projects?category=kitchen"
                  className="hover:text-contractor-gold transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Kitchen Remodeling
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=bathroom"
                  className="hover:text-contractor-gold transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Bathroom Renovation
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=exterior"
                  className="hover:text-contractor-gold transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Exterior Work
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=commercial"
                  className="hover:text-contractor-gold transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Commercial Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=handyman"
                  className="hover:text-contractor-gold transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Handyman Services
                </Link>
              </li>
              <li>
                <Link
                  to="/projects?category=flooring"
                  className="hover:text-contractor-gold transition-colors"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Flooring Installation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:929-386-3248"
                  className="hover:text-contractor-gold transition-colors"
                >
                  929-386-3248
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:info@arshcontractors.com?subject=Inquiry about your services&body=Hello,%0D%0A%0D%0AI'm interested in your renovation services. Could you please provide more information about your services and availability?%0D%0A%0D%0AThank you,%0D%0A[Your Name]"
                  className="hover:text-contractor-gold transition-colors"
                >
                  info@arshcontractors.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Bergen County, NJ</span>
              </div>
              <div className="text-sm">
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

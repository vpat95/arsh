import { Button } from "@/components/ui/button";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll function for navigation links
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    // Only handle smooth scroll if we're on the homepage
    if (location.pathname === "/") {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
    // If not on homepage, let the default href behavior handle the navigation
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container-width">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 contractor-gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">
                  Arsh Consultancy & Contractors
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professional Renovation Services
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/#services"
                onClick={(e) => handleSmoothScroll(e, "services")}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="/#about"
                onClick={(e) => handleSmoothScroll(e, "about")}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                About
              </a>
              <Link
                to="/projects"
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                Projects
              </Link>
              <a
                href="/#contact"
                onClick={(e) => handleSmoothScroll(e, "contact")}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                Contact
              </a>
            </nav>

            {/* CTA and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="hero"
                size="lg"
                className="hidden sm:flex items-center"
              >
                <Phone className="w-4 h-4" />
                929-386-3248
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-background/95 backdrop-blur-sm border-l shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 contractor-gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold text-primary">Arsh Contractors</span>
            </div>
            <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="space-y-6">
            <a
              href="/#services"
              onClick={(e) => handleSmoothScroll(e, "services")}
              className="block text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
            >
              Services
            </a>
            <a
              href="/#about"
              onClick={(e) => handleSmoothScroll(e, "about")}
              className="block text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
            >
              About
            </a>
            <Link
              to="/projects"
              onClick={closeMobileMenu}
              className="block text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
            >
              Projects
            </Link>
            <a
              href="/#contact"
              onClick={(e) => handleSmoothScroll(e, "contact")}
              className="block text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
            >
              Contact
            </a>
          </nav>

          {/* Mobile CTA Button */}
          <div className="mt-8 pt-8 border-t">
            <Button
              variant="secondary"
              size="lg"
              className="w-full contractor-button-shadow"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call (929) 386-3248
            </Button>
          </div>

          {/* Mobile Contact Info */}
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Bergen County, NJ</p>
            <p>Professional Renovation Services</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

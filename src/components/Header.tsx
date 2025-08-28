import arshLogo from "@/assets/arsh_logo.webp";
import { Button } from "@/components/ui/button";
import { useProjectContext } from "@/contexts/ProjectContext";
import { Facebook, Instagram, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { clearSelectedCategory } = useProjectContext();

  // Smooth scroll function for navigation links
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    console.log("handleSmoothScroll called with targetId:", targetId); // Debug log
    console.log("Current pathname:", location.pathname); // Debug log

    // If we're not on the homepage, navigate there first with hash
    if (location.pathname !== "/") {
      console.log("Navigating to:", `/#${targetId}`); // Debug log
      navigate(`/#${targetId}`);
    } else {
      // If we're already on the homepage, scroll to the target
      const targetElement = document.getElementById(targetId);
      console.log("Target element found (direct):", !!targetElement); // Debug log
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }

    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  // Handle logo click - always go to homepage top
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/");
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  // Handle Projects navigation
  const handleProjectsNavigation = () => {
    // Clear the selected category state
    clearSelectedCategory();

    // Always navigate to the main projects page, clearing any category parameters
    navigate("/projects", { replace: true });
    setIsMobileMenuOpen(false);
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

  // Handle hash navigation when navigating from another page
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const targetId = location.hash.substring(1); // Remove the # from the hash
      console.log("Attempting to scroll to:", targetId); // Debug log

      // Special handling for About section due to Elfsight widget loading
      const isAboutSection = targetId === "about";

      // Function to scroll to target
      const scrollToTarget = () => {
        const targetElement = document.getElementById(targetId);
        console.log("Scrolling to target element:", !!targetElement); // Debug log
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return true;
        }
        return false;
      };

      // If it's the About section, wait for Elfsight widget to load
      if (isAboutSection) {
        // Check if Elfsight widget is already loaded
        const elfsightWidget = document.querySelector(
          ".elfsight-app-ff572c65-3037-4b9a-8aac-b135cb9612ca"
        );
        const isElfsightLoaded =
          elfsightWidget && !elfsightWidget.classList.contains("opacity-0");

        if (isElfsightLoaded) {
          // Widget already loaded, scroll immediately
          setTimeout(scrollToTarget, 100);
        } else {
          // Wait for Elfsight widget to load
          const handleElfsightLoaded = () => {
            console.log("Elfsight widget loaded, scrolling to About section");
            setTimeout(scrollToTarget, 200);
            window.removeEventListener(
              "elfsightWidgetLoaded",
              handleElfsightLoaded
            );
          };

          window.addEventListener("elfsightWidgetLoaded", handleElfsightLoaded);

          // Fallback: scroll anyway after 3 seconds
          setTimeout(() => {
            window.removeEventListener(
              "elfsightWidgetLoaded",
              handleElfsightLoaded
            );
            scrollToTarget();
          }, 3000);
        }
      } else {
        // For other sections, use normal timing
        const tryScroll = (delay: number) => {
          setTimeout(() => {
            if (!scrollToTarget() && delay < 2000) {
              tryScroll(delay + 200);
            }
          }, delay);
        };

        tryScroll(500);
        tryScroll(1000);
        tryScroll(1500);
      }
    }
  }, [location.hash, location.pathname]);

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
            <a href="/" onClick={handleLogoClick} className="flex items-center">
              <img
                src={arshLogo}
                alt="Arsh Consultancy & Contractors Logo"
                className="h-16 w-auto"
              />
            </a>

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
              <button
                onClick={handleProjectsNavigation}
                className="text-foreground hover:text-primary transition-colors duration-200"
              >
                Projects
              </button>
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
              {/* Social Media Links - Visible on all screen sizes */}
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.facebook.com/kusharsh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#1877F2] hover:text-[#166FE5] hover:scale-110 transition-all duration-200"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://www.instagram.com/arsh.c.contractors.inc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-[#E4405F] hover:text-[#D63384] hover:scale-110 transition-all duration-200"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>

              <a href="tel:929-386-3248" className="hidden sm:flex">
                <Button variant="hero" size="lg" className="flex items-center">
                  <Phone className="w-4 h-4" />
                  Call for Free Estimate
                </Button>
              </a>
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
            <div className="flex items-center">
              <a href="/" onClick={handleLogoClick}>
                <img
                  src={arshLogo}
                  alt="Arsh Consultancy & Contractors Logo"
                  className="h-14 w-auto"
                />
              </a>
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
              onClick={handleProjectsNavigation}
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

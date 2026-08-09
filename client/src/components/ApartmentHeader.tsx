import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoImage from "@assets/ChatGPT Image Jun 5, 2025 at 09_41_53 AM_1749114429349.png";

const ApartmentHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [_, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setLocation(`/#${id}`, { replace: true });
    }
  };

  return (
    <header className={cn(
      "fixed w-full z-50 transition-all duration-300",
      isScrolled ? "shadow-md bg-opacity-95" : ""
    )} style={{ backgroundColor: '#faf7f2' }}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={logoImage} alt="Jávea Bliss Logo" className="h-16 w-auto" width="64" height="64" />
          <div className="flex flex-col">
            <h1 className="text-primary font-montserrat font-bold text-xl md:text-2xl">
              JÁVEA BLISS
            </h1>
          </div>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <button onClick={() => scrollToSection("home")} className="font-montserrat font-medium hover:text-secondary transition">Home</button>
          <button onClick={() => scrollToSection("apartment")} className="font-montserrat font-medium hover:text-secondary transition">Apartment</button>
          <button onClick={() => scrollToSection("location")} className="font-montserrat font-medium hover:text-secondary transition">Location</button>
          <button onClick={() => scrollToSection("gallery")} className="font-montserrat font-medium hover:text-secondary transition">Gallery</button>
          <button onClick={() => scrollToSection("booking")} className="font-montserrat font-medium hover:text-secondary transition">Book Now</button>
        </nav>
        
        <Button variant="ghost" className="md:hidden text-primary p-1" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full" style={{ backgroundColor: '#faf7f2' }}>
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <button 
              onClick={() => scrollToSection("home")} 
              className="font-montserrat font-medium hover:text-secondary transition py-2 border-b border-gray-100 text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("apartment")} 
              className="font-montserrat font-medium hover:text-secondary transition py-2 border-b border-gray-100 text-left"
            >
              Apartment
            </button>
            <button 
              onClick={() => scrollToSection("location")} 
              className="font-montserrat font-medium hover:text-secondary transition py-2 border-b border-gray-100 text-left"
            >
              Location
            </button>
            <button 
              onClick={() => scrollToSection("gallery")} 
              className="font-montserrat font-medium hover:text-secondary transition py-2 border-b border-gray-100 text-left"
            >
              Gallery
            </button>
            <button 
              onClick={() => scrollToSection("booking")} 
              className="font-montserrat font-medium hover:text-secondary transition py-2 text-left"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default ApartmentHeader;

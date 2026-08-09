import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import WeatherDisplay from "./WeatherDisplay";
import { useLanguage, getPathWithoutLanguage } from "../contexts/LanguageContext";
import { useLocation } from "wouter";
import logo from "../assets/images/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, language, getLocalizedPath } = useLanguage();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToSection = (id: string) => {
    // Check if we're on the home page (with or without language prefix)
    const pathWithoutLang = getPathWithoutLanguage(location);
    const isHomePage = pathWithoutLang === '/' || pathWithoutLang === '';
    
    if (!isHomePage) {
      // Navigate to home first with language prefix
      setLocation(getLocalizedPath('/'));
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const navHeight = 136;
          const elementPosition = element.offsetTop - navHeight;
          window.scrollTo({
            top: elementPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        const navHeight = 136;
        const elementPosition = element.offsetTop - navHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth"
        });
      }
    }
    setIsOpen(false);
  };

  const navItems = [
    { key: 'nav.home', id: 'home' },
    { key: 'nav.apartment', id: 'apartment' },
    { key: 'nav.gallery', id: 'gallery' },
    { key: 'nav.rates', id: 'rates' },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md top-0' : 'bg-transparent top-14'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateToSection('home')}
          >
            <span 
              className="font-montserrat font-bold text-xl md:text-2xl"
              style={{ color: isScrolled ? '#1e3a5f' : '#ffffff' }}
            >
              JÁVEA BLISS
            </span>
            <img 
              src={logo} 
              alt="Jávea Bliss Logo" 
              className="h-8 w-auto md:h-10"
              width="40"
              height="40"
            />
          </div>

          {/* Desktop Navigation - Switch to dropdown on smaller screens */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className={`font-montserrat font-medium transition-colors hover:text-accent ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {t(item.key)}
              </button>
            ))}
            <Button
              onClick={() => navigateToSection('booking')}
              className="bg-accent hover:bg-secondary transition text-white font-montserrat font-semibold px-6 py-2 rounded-md"
            >
              {t('nav.booking')}
            </Button>
            <div className={`px-3 py-2 rounded-md ${isScrolled ? 'bg-gray-50' : 'bg-white/20 backdrop-blur-sm'}`}>
              <WeatherDisplay />
            </div>
            <LanguageSwitcher />
          </div>

          {/* Tablet and Mobile Navigation - Dropdown menu for smaller screens */}
          <div className="flex lg:hidden items-center space-x-2">
            <div className={`px-2 py-1 rounded-md ${isScrolled ? 'bg-gray-50' : 'bg-white/20 backdrop-blur-sm'}`}>
              <WeatherDisplay />
            </div>
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={isScrolled ? 'text-gray-700' : 'text-white'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              data-testid="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile and Tablet Navigation Menu with ARIA and focus management */}
        {isOpen && (
          <div 
            className="md:bg-white md:border-t md:shadow-lg lg:hidden"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            <div className="py-4 space-y-2 bg-white" role="menu">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => navigateToSection(item.id)}
                  className="block w-full text-left px-4 py-2 font-montserrat font-medium text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors"
                  role="menuitem"
                  tabIndex={0}
                  data-testid={`mobile-nav-${item.id}`}
                >
                  {t(item.key)}
                </button>
              ))}
              <button
                onClick={() => navigateToSection('booking')}
                className="block w-full text-left px-4 py-2 font-montserrat font-semibold text-accent hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent transition-colors"
                role="menuitem"
                tabIndex={0}
                data-testid="mobile-nav-booking"
              >
                {t('nav.booking')}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
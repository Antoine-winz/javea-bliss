import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import WeatherDisplay from "./WeatherDisplay";
import { useLanguage, getPathWithoutLanguage } from "../contexts/LanguageContext";
import { useLocation } from "wouter";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, getLocalizedPath } = useLanguage();
  const [location, setLocation] = useLocation();

  // Pages other than the homepage have a light background under the bar, so the
  // transparent-over-photo treatment only applies on the homepage.
  const isHomePage = (() => {
    const p = getPathWithoutLanguage(location);
    return p === '/' || p === '';
  })();
  const solid = isScrolled || !isHomePage || isOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigateToSection = (id: string) => {
    const goTo = () => {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({ top: element.offsetTop - 72, behavior: "smooth" });
      }
    };

    if (!isHomePage) {
      setLocation(getLocalizedPath('/'));
      setTimeout(goTo, 120);
    } else {
      goTo();
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
      // --promo-h is set by PromotionalHeader when an offer bar is showing.
      style={{ top: 'var(--promo-h, 0px)' }}
      className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
        solid ? 'bg-bone/95 backdrop-blur-md border-b border-ink/10' : 'bg-transparent'
      }`}
    >
      <div className="shell px-6 md:px-10">
        <div className="flex items-center justify-between h-[72px]">
          <button
            onClick={() => navigateToSection('home')}
            className={`font-display text-xl md:text-2xl tracking-wide transition-colors duration-500 ${
              solid ? 'text-ink' : 'text-bone'
            }`}
            aria-label="Jávea Bliss — home"
          >
            Jávea Bliss
          </button>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className={`font-sans text-[0.8125rem] tracking-[0.12em] uppercase transition-colors duration-300 hover:text-brass ${
                  solid ? 'text-ink-soft' : 'text-bone/90'
                }`}
              >
                {t(item.key)}
              </button>
            ))}

            <div className={`flex items-center gap-5 pl-8 border-l ${solid ? 'border-ink/12' : 'border-bone/25'}`}>
              <div className={solid ? 'text-ink-soft' : 'text-bone/85'}>
                <WeatherDisplay />
              </div>
              <LanguageSwitcher />
              <button
                onClick={() => navigateToSection('booking')}
                className={`font-sans text-[0.8125rem] tracking-[0.12em] uppercase px-6 py-3 transition-colors duration-300 ${
                  solid
                    ? 'bg-ink text-bone hover:bg-brass'
                    : 'bg-bone/95 text-ink hover:bg-brass hover:text-white'
                }`}
              >
                {t('nav.booking')}
              </button>
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <div className={solid ? 'text-ink-soft' : 'text-bone/85'}>
              <WeatherDisplay />
            </div>
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 -mr-2 transition-colors ${solid ? 'text-ink' : 'text-bone'}`}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              data-testid="mobile-menu-toggle"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-bone border-t border-ink/10"
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <div className="shell px-6 py-4" role="menu">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateToSection(item.id)}
                className="block w-full text-left py-4 font-sans text-[0.8125rem] tracking-[0.12em] uppercase text-ink-soft border-b border-ink/10 hover:text-brass transition-colors"
                role="menuitem"
                data-testid={`mobile-nav-${item.id}`}
              >
                {t(item.key)}
              </button>
            ))}
            <button
              onClick={() => navigateToSection('booking')}
              className="mt-6 mb-2 w-full btn-primary"
              role="menuitem"
              data-testid="mobile-nav-booking"
            >
              {t('nav.booking')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

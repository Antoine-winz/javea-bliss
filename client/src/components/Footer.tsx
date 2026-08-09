
import { FaAirbnb } from "react-icons/fa";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const seoGuides = [
  { href: '/en/holiday-apartment-javea-arenal-beach/', label: 'Holiday Apartment near Arenal Beach' },
  { href: '/en/2-bedroom-apartment-javea/', label: '2-Bedroom Apartment in Javea' },
  { href: '/en/where-to-stay-in-javea/', label: 'Where to Stay in Javea' },
  { href: '/en/javea-arenal-beach-guide/', label: 'Arenal Beach Guide' },
  { href: '/en/restaurants-near-arenal-beach-javea/', label: 'Best Restaurants near Arenal' },
  { href: '/en/best-beaches-near-javea-apartment/', label: 'Best Beaches near Javea' },
  { href: '/en/javea-without-car/', label: 'Javea Without a Car' },
  { href: '/en/winter-rental-javea/', label: 'Winter Rental in Javea' },
  { href: '/en/javea-3-day-itinerary/', label: '3-Day Javea Itinerary' },
];

const Footer = () => {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const quickLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'apartment', label: t('nav.apartment') },
    { id: 'location', label: t('nav.location') },
    { id: 'gallery', label: t('nav.gallery') },
    { id: 'booking', label: t('nav.booking') },
  ];

  return (
    <footer className="bg-ink text-bone px-6 md:px-10 pt-20 md:pt-28 pb-10">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-14 gap-x-16">
          <div className="lg:col-span-4">
            <p className="font-display text-3xl mb-5">Jávea Bliss</p>
            <p className="text-bone/65 font-light leading-relaxed max-w-sm">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="lg:col-span-3">
            <h4 className="eyebrow text-bone/45 mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToSection(id)}
                    className="text-bone/75 hover:text-brass transition-colors text-[0.9375rem]"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="eyebrow text-bone/45 mb-6">{t('footer.guides')}</h4>
            <ul className="space-y-3">
              {seoGuides.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-bone/75 hover:text-brass transition-colors text-[0.9375rem]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="eyebrow text-bone/45 mb-6">{t('footer.followUs')}</h4>
            <a
              href="https://www.airbnb.com/rooms/1437724898890828336"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-bone/75 hover:text-brass transition-colors"
              aria-label="Jávea Bliss on Airbnb"
            >
              <FaAirbnb size={22} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/12 mt-16 pt-8 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-bone/45">
            &copy; {new Date().getFullYear()} Jávea Bliss. {t('footer.rights')}
          </p>
          <p className="text-[0.8125rem] text-bone/45">Jávea (Xàbia), Alicante, España</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

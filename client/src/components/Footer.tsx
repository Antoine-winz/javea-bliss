
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

  return (
    <footer className="bg-primary text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="mb-8 md:mb-0">
            <h3 className="font-montserrat font-bold text-2xl mb-3">JÁVEA BLISS</h3>
            <p className="max-w-md">{t('footer.tagline')}</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12">
            <div>
              <h4 className="font-montserrat font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection("home")} className="hover:text-secondary transition">{t('nav.home')}</button></li>
                <li><button onClick={() => scrollToSection("apartment")} className="hover:text-secondary transition">{t('nav.apartment')}</button></li>
                <li><button onClick={() => scrollToSection("location")} className="hover:text-secondary transition">{t('nav.location')}</button></li>
                <li><button onClick={() => scrollToSection("gallery")} className="hover:text-secondary transition">{t('nav.gallery')}</button></li>
                <li><button onClick={() => scrollToSection("booking")} className="hover:text-secondary transition">{t('nav.booking')}</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-montserrat font-semibold text-lg mb-4">Javea Guides</h4>
              <ul className="space-y-2">
                {seoGuides.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-secondary transition text-sm">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-montserrat font-semibold text-lg mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://www.airbnb.com/rooms/1437724898890828336?location=Javea%20spaiin&search_mode=regular_search&adults=1&check_in=2025-07-12&check_out=2025-07-17&children=0&infants=0&pets=0&source_impression_id=p3_1752124817_P3RTWcRaUsEkoM5Y&previous_page_section_name=1001&federated_search_id=44f92839-24c4-4baf-90b6-63214bfbdc8c" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition">
                  <FaAirbnb size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Jávea Bliss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

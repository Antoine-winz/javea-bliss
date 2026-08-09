import {
  Wind,
  Wifi,
  Tv,
  Utensils,
  Shirt,
  ParkingSquare,
  Umbrella,
  ShowerHead,
  Coffee,
  ShieldCheck,
  PawPrint
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AmenitiesSection = () => {
  const { t } = useLanguage();
  
  const amenities = [
    { icon: <Wind className="h-8 w-8" />, label: t('amenityList.airConditioning') },
    { icon: <Wifi className="h-8 w-8" />, label: t('amenityList.wifi') },
    { icon: <Tv className="h-8 w-8" />, label: t('amenityList.smartTv') },
    { icon: <Utensils className="h-8 w-8" />, label: t('amenityList.kitchen') },
    { icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Water filter housing */}
        <rect x="8" y="4" width="8" height="16" rx="2" />
        
        {/* Water inlet pipe */}
        <path d="M4 8h4" />
        <path d="M4 6v4" />
        
        {/* Water outlet pipe */}
        <path d="M16 16h4" />
        <path d="M20 14v4" />
        
        {/* Filter cartridge inside */}
        <rect x="9" y="6" width="6" height="12" rx="1" fill="none" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
        
        {/* Water drops */}
        <circle cx="18" cy="18" r="1" fill="currentColor" />
        <circle cx="21" cy="16" r="0.5" fill="currentColor" />
        
        {/* Quality indicator */}
        <circle cx="12" cy="2" r="1" fill="currentColor" />
      </svg>
    ), label: t('amenityList.waterFilter') },
    { icon: <Shirt className="h-8 w-8" />, label: t('amenityList.washer') },
    { icon: <ParkingSquare className="h-8 w-8" />, label: t('amenityList.parking') },
    { icon: <Coffee className="h-8 w-8" />, label: t('amenityList.nespresso') },
    { icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Dishwasher body */}
        <rect x="3" y="3" width="18" height="18" rx="2" />
        
        {/* Dishwasher door */}
        <rect x="3" y="10" width="18" height="11" rx="1" />
        
        {/* Plates inside */}
        <circle cx="8" cy="15" r="2.5" />
        <circle cx="13" cy="15" r="2" />
        <circle cx="17" cy="15" r="1.5" />
        
        {/* Control buttons */}
        <circle cx="6" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="9" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="12" cy="6.5" r="0.5" fill="currentColor" />
        
        {/* Handle */}
        <line x1="19" y1="6" x2="19" y2="8" strokeWidth="3" />
      </svg>
    ), label: t('amenityList.dishwasher') },
    { icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Towel rack horizontal bar */}
        <circle cx="2" cy="4" r="1" />
        <circle cx="22" cy="4" r="1" />
        <line x1="3" y1="4" x2="21" y2="4" />
        
        {/* Left hanging towel */}
        <path d="M6 4v2c0 1 1 2 2 2h2c1 0 2-1 2-2V4" />
        <path d="M6 6v10c0 1 1 2 2 2h2c1 0 2-1 2-2V6" />
        <line x1="6" y1="12" x2="12" y2="12" />
        
        {/* Right hanging towel */}
        <path d="M14 4v3c0 1 1 2 2 2h2c1 0 2-1 2-2V4" />
        <path d="M14 7v9c0 1 1 2 2 2h2c1 0 2-1 2-2V7" />
        <line x1="14" y1="13" x2="20" y2="13" />
      </svg>
    ), label: t('amenityList.showerTowels') },
    { icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Beach umbrella */}
        <path d="M12 8v10" />
        <path d="M6 8c0-3 2.5-6 6-6s6 3 6 6" />
        <path d="M6 8c0 0 2-1 6-1s6 1 6 1" />
        <path d="M7 8l5-4 5 4" />
        
        {/* Beach towel laid flat */}
        <path d="M4 14c0-1 1-2 2-2h12c1 0 2 1 2 2v4c0 1-1 2-2 2H6c-1 0-2-1-2-2v-4z" />
        <path d="M4 16h16" />
        <path d="M4 18h16" />
        <path d="M6 14v6" />
        <path d="M10 14v6" />
        <path d="M14 14v6" />
        <path d="M18 14v6" />
      </svg>
    ), label: t('amenityList.beachTowels') },
    { icon: <PawPrint className="h-8 w-8" />, label: t('amenityList.noPets'), disabled: true }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-2">{t('amenities.title')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <div key={index} className={`flex flex-col items-center text-center ${amenity.disabled ? 'opacity-50' : ''}`}>
              <div className={`mb-3 ${amenity.disabled ? 'text-gray-400' : 'text-secondary'}`}>{amenity.icon}</div>
              <span className={`font-medium ${amenity.disabled ? 'text-gray-500' : ''}`}>{amenity.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;

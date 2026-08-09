import {
  Wind,
  Wifi,
  Tv,
  CookingPot,
  Utensils,
  Coffee,
  Droplets,
  WashingMachine,
  Car,
  Bath,
  Waves,
  PawPrint,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/*
  The complete checklist. The apartment section above describes the place in prose; this
  is the scannable list a guest checks against their own requirements, so it stays flat
  and complete rather than being folded into that narrative.

  Icons here are stone, not brass: they should recede behind the apartment section's
  accented ones rather than compete with them.
*/
const AMENITIES = [
  { icon: Wind, key: 'amenityList.airConditioning' },
  { icon: Wifi, key: 'amenityList.wifi' },
  { icon: Tv, key: 'amenityList.smartTv' },
  { icon: CookingPot, key: 'amenityList.kitchen' },
  { icon: Utensils, key: 'amenityList.dishwasher' },
  { icon: Coffee, key: 'amenityList.nespresso' },
  { icon: Droplets, key: 'amenityList.waterFilter' },
  { icon: WashingMachine, key: 'amenityList.washer' },
  { icon: Car, key: 'amenityList.parking' },
  { icon: Bath, key: 'amenityList.showerTowels' },
  { icon: Waves, key: 'amenityList.beachTowels' },
  { icon: PawPrint, key: 'amenityList.noPets', absent: true },
] as const;

const AmenitiesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="section bg-bone">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-16">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-5">{t('amenities.eyebrow')}</p>
            <h2 className="display-lg">{t('amenities.title')}</h2>
          </div>

          <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
            {AMENITIES.map(({ icon: Icon, key, absent }) => (
              <li
                key={key}
                className={`hairline py-4 grid grid-cols-[1.25rem_1fr] gap-x-4 items-center text-[0.95rem] ${
                  absent ? 'text-stone' : 'text-ink-soft'
                }`}
              >
                <Icon
                  className={`w-[18px] h-[18px] ${absent ? 'text-stone/50' : 'text-stone'}`}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className={absent ? 'line-through decoration-stone/40' : undefined}>
                  {t(key)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;

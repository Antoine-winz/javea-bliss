import {
  Car,
  Wifi,
  Wind,
  Flame,
  ArrowUpDown,
  CookingPot,
  Utensils,
  Coffee,
  Droplets,
  WashingMachine,
  Tv,
  Waves,
  Bath,
  PawPrint,
  Ban,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/*
  The complete checklist. The apartment section above describes the place in prose; this
  is the scannable list a guest checks against their own requirements, so it stays flat
  and complete rather than being folded into that narrative.

  Ordered differentiators first — free parking and 600 Mbps are the things this apartment
  has that its competitors mostly do not — then commodities, then what is deliberately
  not here. Icons are stone, not brass: they should recede behind the apartment section's
  accented ones rather than compete with them.
*/
const INCLUDED = [
  { icon: Car, key: 'amenityList.parking' },
  { icon: Wifi, key: 'amenityList.wifi' },
  { icon: Wind, key: 'amenityList.airConditioning' },
  { icon: Flame, key: 'amenityList.heating' },
  { icon: ArrowUpDown, key: 'amenityList.lift' },
  { icon: CookingPot, key: 'amenityList.kitchen' },
  { icon: Utensils, key: 'amenityList.dishwasher' },
  { icon: Coffee, key: 'amenityList.nespresso' },
  { icon: Droplets, key: 'amenityList.waterFilter' },
  { icon: WashingMachine, key: 'amenityList.washer' },
  { icon: Tv, key: 'amenityList.smartTv' },
  { icon: Waves, key: 'amenityList.beachTowels' },
  { icon: Bath, key: 'amenityList.showerTowels' },
] as const;

// Stated plainly rather than hidden. Saying what is missing reads as confidence, and it
// stops a guest discovering it on arrival.
const NOT_INCLUDED = [
  { icon: PawPrint, key: 'amenityList.noPets' },
  { icon: Ban, key: 'amenityList.noDryer' },
] as const;

const AmenitiesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="section bg-bone">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-16">
          <div className="lg:col-span-4" data-reveal>
            <p className="eyebrow mb-5">{t('amenities.eyebrow')}</p>
            <h2 className="display-lg">{t('amenities.title')}</h2>
          </div>

          <div className="lg:col-span-8">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12" data-reveal-stagger>
              {INCLUDED.map(({ icon: Icon, key }) => (
                <li
                  key={key}
                  className="hairline py-4 grid grid-cols-[1.25rem_1fr] gap-x-4 items-center text-[0.95rem] text-ink-soft"
                >
                  <Icon
                    className="w-[18px] h-[18px] text-stone"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12" data-reveal>
              <h3 className="eyebrow mb-1">{t('amenityList.notIncluded')}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                {NOT_INCLUDED.map(({ icon: Icon, key }) => (
                  <li
                    key={key}
                    className="hairline py-4 grid grid-cols-[1.25rem_1fr] gap-x-4 items-center text-[0.95rem] text-stone"
                  >
                    <Icon
                      className="w-[18px] h-[18px] text-stone/50"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;

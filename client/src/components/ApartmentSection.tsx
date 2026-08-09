import { BedDouble, Sofa, CookingPot, ShowerHead, Sun, Thermometer, Building2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import apartmentImage from "@assets/Livingroom1_optimized.jpeg";

/*
  Ordered as a walk through the apartment — where you sleep first, since capacity and bed
  configuration are what a guest checks before anything else, then the rooms in the order
  you meet them, then the things that make a long stay work (climate, Wi-Fi) and finally
  the building. Neighbourhood facts that used to sit here (the marina, the shops, the
  restaurant walking times) now live in the location section where guests look for them.
*/
const GROUPS = [
  // The sofa bed sits here rather than in the living-room line: a fifth berth buried in a
  // paragraph about the lounge is a well-known cause of arrival-day disappointment.
  { icon: BedDouble, label: 'interior.group.bedrooms', lines: ['interior.bedrooms', 'interior.sofabed'] },
  { icon: Sofa, label: 'interior.group.living', lines: ['interior.lounge', 'interior.lighting'] },
  { icon: CookingPot, label: 'interior.group.kitchen', lines: ['interior.kitchen'] },
  { icon: ShowerHead, label: 'interior.group.bathroom', lines: ['interior.bathroom'] },
  { icon: Sun, label: 'interior.group.terrace', lines: ['interior.patio', 'interior.laundry'] },
  // Thermometer rather than Wind: this group covers heating as well as cooling.
  { icon: Thermometer, label: 'interior.group.comfort', lines: ['interior.connectivity'] },
  { icon: Building2, label: 'building.title', lines: ['building.security'] },
] as const;

const ApartmentSection = () => {
  const { t } = useLanguage();

  return (
    <section id="apartment" className="section bg-sand">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-14 gap-x-16 items-start">
          {/* Sticky on desktop so the photograph stays with the description it belongs to. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="ratio-portrait overflow-hidden group">
                <img
                  src={apartmentImage}
                  alt="The living room of the apartment at Jávea Bliss"
                  className="img-cover img-zoom"
                  width={900}
                  height={1125}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">{t('apartment.eyebrow')}</p>
            <h2 className="display-lg mb-7">{t('apartment.title')}</h2>
            <p className="lede mb-12">{t('apartment.description')}</p>

            <div className="border-t border-ink/12">
              {GROUPS.map(({ icon: Icon, label, lines }) => (
                <div
                  key={label}
                  className="border-b border-ink/12 py-7 grid grid-cols-[1.5rem_1fr] gap-x-5"
                >
                  <Icon
                    className="w-5 h-5 text-brass mt-[2px]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-ink mb-2.5">
                      {t(label)}
                    </h3>
                    {lines.map((line) => (
                      <p
                        key={line}
                        className="text-[0.95rem] text-ink-soft leading-relaxed [&+p]:mt-2"
                      >
                        {t(line)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentSection;

import { useLanguage } from "../contexts/LanguageContext";
import apartmentImage from "@assets/Livingroom1_optimized.jpeg";

const WALKING_TIMES = [
  { name: 'La Fontana', minutes: 3 },
  { name: 'Chabada', minutes: 5 },
  { name: 'La Bambula', minutes: 6 },
  { name: 'Bohemians', minutes: 6 },
];

const ApartmentSection = () => {
  const { t, getLocalizedPath } = useLanguage();

  const interiorFeatures = [
    t('interior.bedrooms'),
    t('interior.bathroom'),
    t('interior.kitchen'),
    t('interior.lounge'),
    t('interior.lighting'),
    t('interior.patio'),
    t('interior.laundry'),
    t('interior.connectivity'),
  ];

  const buildingFeatures = [
    t('building.security'),
    t('building.marina'),
    t('building.shopping'),
  ];

  return (
    <section id="apartment" className="section bg-sand">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-14 gap-x-16 items-start">
          {/* Image column — sticky on desktop so the long feature list scrolls past it. */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="ratio-portrait overflow-hidden group">
                <img
                  src={apartmentImage}
                  alt="Inside the apartment at Jávea Bliss"
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
            <p className="lede mb-14">{t('apartment.description')}</p>

            <h3 className="display-md mb-6">{t('interior.title')}</h3>
            <ul className="mb-14">
              {interiorFeatures.map((feature) => (
                <li key={feature} className="hairline py-4 text-[0.95rem] leading-relaxed">
                  {feature}
                </li>
              ))}
            </ul>

            <h3 className="display-md mb-6">{t('building.title')}</h3>
            <ul>
              {buildingFeatures.map((feature) => (
                <li key={feature} className="hairline py-4 text-[0.95rem] leading-relaxed">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Walking times to the restaurants people actually ask about. */}
        <div className="mt-20 md:mt-28 pt-14 border-t border-ink/12">
          <div className="grid lg:grid-cols-12 gap-y-10 gap-x-16">
            <div className="lg:col-span-5">
              <h3 className="display-md mb-4">{t('apartment.restaurantProximity')}</h3>
              <p className="text-[0.95rem] text-ink-soft max-w-md mb-7">
                {t('apartment.restaurantProximityDesc')}
              </p>
              <a href={getLocalizedPath('/recommendations')} className="link-underline">
                {t('apartment.viewAllRestaurants')}
              </a>
            </div>

            <div className="lg:col-span-7">
              <ul className="grid grid-cols-2 gap-x-12">
                {WALKING_TIMES.map(({ name, minutes }) => (
                  <li
                    key={name}
                    className="hairline py-5 flex items-baseline justify-between gap-4"
                  >
                    <span className="font-display text-xl text-ink">{name}</span>
                    <span className="font-sans text-[0.8125rem] tracking-[0.1em] uppercase text-stone whitespace-nowrap">
                      {minutes} {t('rec.location.walk')}
                    </span>
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

export default ApartmentSection;

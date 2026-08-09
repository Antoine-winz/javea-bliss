import { useLanguage } from "@/contexts/LanguageContext";

const AmenitiesSection = () => {
  const { t } = useLanguage();

  const amenities = [
    { label: t('amenityList.airConditioning') },
    { label: t('amenityList.wifi') },
    { label: t('amenityList.smartTv') },
    { label: t('amenityList.kitchen') },
    { label: t('amenityList.dishwasher') },
    { label: t('amenityList.nespresso') },
    { label: t('amenityList.waterFilter') },
    { label: t('amenityList.washer') },
    { label: t('amenityList.parking') },
    { label: t('amenityList.showerTowels') },
    { label: t('amenityList.beachTowels') },
    { label: t('amenityList.noPets'), absent: true },
  ];

  return (
    <section className="section bg-bone">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-16">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-5">{t('amenities.eyebrow')}</p>
            <h2 className="display-lg">{t('amenities.title')}</h2>
          </div>

          <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
            {amenities.map(({ label, absent }) => (
              <li
                key={label}
                className={`hairline py-4 flex items-baseline gap-3 text-[0.95rem] ${
                  absent ? 'text-stone' : 'text-ink-soft'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`text-xs leading-none ${absent ? 'text-stone/60' : 'text-brass'}`}
                >
                  {absent ? '—' : '+'}
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;

import { useLanguage } from "../contexts/LanguageContext";

const AtGlanceSection = () => {
  const { t } = useLanguage();

  // A spec sheet, not four decorated cards. The facts are the selling point, so
  // they are set as type rather than dressed up with icons.
  const specs = [
    t('glance.sleeps'),
    t('glance.bedrooms'),
    t('glance.bathroom'),
    t('glance.beach'),
    t('glance.ac'),
    t('glance.wifi'),
    t('glance.parking'),
    t('glance.terrace'),
  ];

  return (
    <section className="section bg-bone">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-12 gap-x-16">
          <div className="lg:col-span-5" data-reveal>
            <p className="eyebrow mb-5">{t('glance.eyebrow')}</p>
            <h2 className="display-lg">{t('glance.title')}</h2>
          </div>

          <div className="lg:col-span-7">
            <p className="lede mb-12" data-reveal>{t('hero.description')}</p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-12" data-reveal-stagger>
              {specs.map((spec) => (
                <li
                  key={spec}
                  className="hairline py-4 font-sans text-[0.95rem] text-ink-soft"
                >
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AtGlanceSection;

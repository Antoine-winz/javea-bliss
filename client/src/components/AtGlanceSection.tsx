import { useLanguage } from "../contexts/LanguageContext";

/*
  A thin band of the eight facts guests check first, directly under the hero.
  Replaces the old full-height "At a Glance" section, which repeated the hero
  paragraph and left most of a screen empty around eight short lines.
*/
const AtGlanceSection = () => {
  const { t } = useLanguage();

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
    <section className="bg-sand border-b border-ink/10">
      <div className="shell px-6 md:px-10">
        <ul
          className="flex flex-wrap justify-center gap-x-10 gap-y-3 py-7 md:py-8"
          data-reveal
        >
          {specs.map((spec) => (
            <li
              key={spec}
              className="font-sans text-[0.75rem] tracking-[0.14em] uppercase text-ink-soft whitespace-nowrap"
            >
              {spec}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AtGlanceSection;

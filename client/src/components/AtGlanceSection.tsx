import { useLanguage } from "../contexts/LanguageContext";
import {
  Armchair,
  Bath,
  BedDouble,
  CarFront,
  Snowflake,
  Sun,
  Waves,
  Wifi,
} from "lucide-react";

/*
  A thin band of the eight facts guests check first, directly under the hero.
  Replaces the old full-height "At a Glance" section, which repeated the hero
  paragraph and left most of a screen empty around eight short lines.
*/
const AtGlanceSection = () => {
  const { t } = useLanguage();

  const specs = [
    { label: t('glance.sleeps'), Icon: Armchair },
    { label: t('glance.bedrooms'), Icon: BedDouble },
    { label: t('glance.bathroom'), Icon: Bath },
    { label: t('glance.beach'), Icon: Waves },
    { label: t('glance.ac'), Icon: Snowflake },
    { label: t('glance.wifi'), Icon: Wifi },
    { label: t('glance.parking'), Icon: CarFront },
    { label: t('glance.terrace'), Icon: Sun },
  ];

  return (
    <section className="bg-sand border-b border-ink/10 py-7 md:py-8">
      <div className="shell px-6 md:px-10">
        <div className="flex items-center justify-center gap-3" data-reveal>
          <span className="h-px w-7 bg-brass/80" aria-hidden="true" />
          <p className="eyebrow m-0">{t('glance.label')}</p>
          <span className="h-px w-7 bg-brass/80" aria-hidden="true" />
        </div>

        <ul className="mt-6 grid grid-cols-2 md:grid-cols-4" data-reveal>
          {specs.map(({ label, Icon }) => (
            <li
              key={label}
              className="flex min-h-[2.7rem] items-center gap-2.5 border-l border-ink/15 px-2 py-1.5 md:min-h-[2.9rem] md:px-4"
            >
              <Icon
                className="h-4 w-4 shrink-0 text-brass"
                strokeWidth={1.4}
                aria-hidden="true"
              />
              <span className="font-sans text-[0.6875rem] font-medium uppercase leading-[1.35] tracking-[0.095em] text-ink-soft">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AtGlanceSection;

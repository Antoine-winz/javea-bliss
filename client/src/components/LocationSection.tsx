import { useLanguage } from "@/contexts/LanguageContext";

const LocationSection = () => {
  const { t, getLocalizedPath } = useLanguage();

  const highlights = [
    { title: t('paradise.beach.title'), description: t('paradise.beach.description') },
    { title: t('paradise.watersports.title'), description: t('paradise.watersports.description') },
    { title: t('paradise.dining.title'), description: t('paradise.dining.description') },
    { title: t('paradise.oldtown.title'), description: t('paradise.oldtown.description') },
    { title: t('paradise.walks.title'), description: t('paradise.walks.description') },
  ];

  return (
    <section id="location" className="section bg-ink text-bone">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-12 gap-x-16 mb-20 md:mb-28">
          <div className="lg:col-span-5">
            <p className="eyebrow text-bone/50 mb-5">{t('paradise.eyebrow')}</p>
            <h2 className="display-lg text-bone">{t('paradise.title')}</h2>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="text-bone/80 font-light text-lg leading-relaxed">
              {t('paradise.description1')}
            </p>
            <p className="text-bone/70 font-light leading-relaxed">
              {t('paradise.description2')}
            </p>
          </div>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-14">
          {highlights.map(({ title, description }, i) => (
            <li
              key={title}
              className="hairline-dark py-8 lg:min-h-[13rem]"
            >
              <span className="font-sans text-[0.6875rem] tracking-[0.2em] text-brass block mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl text-bone mb-3">{title}</h3>
              <p className="text-bone/65 text-[0.9375rem] font-light leading-relaxed">
                {description}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-20 pt-14 border-t border-white/16 grid lg:grid-cols-12 gap-y-8 gap-x-16 items-end">
          <div className="lg:col-span-7">
            <h3 className="font-display text-2xl md:text-3xl text-bone mb-4">
              {t('location.restaurantTitle')}
            </h3>
            <p className="text-bone/70 font-light leading-relaxed max-w-2xl">
              {t('location.restaurantDesc')}
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <a href={getLocalizedPath('/recommendations')} className="btn-on-dark">
              {t('location.viewRecommendations')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;

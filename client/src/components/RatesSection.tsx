import { useLanguage } from "../contexts/LanguageContext";

const RatesSection = () => {
  const { t } = useLanguage();

  const rates = [
    { season: t('rates.highSeason'), period: t('rates.highPeriod'), rate: t('rates.highRate') },
    { season: t('rates.midSeason'), period: t('rates.midPeriod'), rate: t('rates.midRate') },
    { season: t('rates.lowSeason'), period: t('rates.lowPeriod'), rate: t('rates.lowRate') },
  ];

  const policies = [
    t('rates.policy1'),
    t('rates.policy2'),
    t('rates.policy3'),
    t('rates.policy4'),
  ];

  return (
    <section id="rates" className="section bg-sand">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-12 gap-x-16">
          {/* Heading, description and the booking policies share the left column,
              beside the season table — one screen, no stranded space. */}
          <div className="lg:col-span-5" data-reveal>
            <p className="eyebrow mb-5">{t('rates.eyebrow')}</p>
            <h2 className="display-lg mb-6">{t('rates.title')}</h2>
            <p className="text-[0.95rem] text-ink-soft leading-relaxed max-w-md mb-10">
              {t('rates.description')}
            </p>

            <h3 className="eyebrow mb-1">{t('rates.policies')}</h3>
            <ul>
              {policies.map((policy) => (
                <li key={policy} className="hairline py-3.5 text-[0.9rem] text-ink-soft">
                  {policy}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-ink/12" data-reveal-stagger>
              {rates.map(({ season, period, rate }) => (
                <div key={season} className="border-b border-ink/12 py-8">
                  <div className="flex items-baseline justify-between gap-6 mb-1.5">
                    <h3 className="font-display text-2xl md:text-[1.75rem] text-ink">
                      {season}
                    </h3>
                    <p className="font-sans text-[0.95rem] text-ink whitespace-nowrap">
                      {rate}
                    </p>
                  </div>
                  <p className="text-[0.9rem] text-stone">{period}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RatesSection;

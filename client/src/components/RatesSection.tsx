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
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-16 mb-16 md:mb-20">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">{t('rates.eyebrow')}</p>
            <h2 className="display-lg">{t('rates.title')}</h2>
          </div>
          <div className="lg:col-span-7">
            <p className="lede">{t('rates.description')}</p>
          </div>
        </div>

        {/* A rate table rather than three coloured cards — this is price information,
            and it reads faster as rows. */}
        <div className="border-t border-ink/12">
          {rates.map(({ season, period, rate }) => (
            <div
              key={season}
              className="border-b border-ink/12 py-7 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 md:items-baseline"
            >
              <h3 className="md:col-span-4 font-display text-2xl md:text-[1.75rem] text-ink">
                {season}
              </h3>
              <p className="md:col-span-5 text-[0.95rem] text-stone">{period}</p>
              <p className="md:col-span-3 font-sans text-[0.95rem] text-ink md:text-right">
                {rate}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid lg:grid-cols-12 gap-y-8 gap-x-16">
          <div className="lg:col-span-4">
            <h3 className="display-md">{t('rates.policies')}</h3>
          </div>
          <ul className="lg:col-span-8 grid sm:grid-cols-2 gap-x-12">
            {policies.map((policy) => (
              <li key={policy} className="hairline py-4 text-[0.95rem] text-ink-soft">
                {policy}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RatesSection;

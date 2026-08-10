import { ShoppingBasket, Car, Sailboat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Walking times guests ask about most. These used to sit at the end of the apartment
// section; they belong with the neighbourhood.
const WALKING_TIMES = [
  { name: 'La Fontana', minutes: 3 },
  { name: 'Chabada', minutes: 5 },
  { name: 'La Bambula', minutes: 6 },
  { name: 'Bohemians', minutes: 6 },
];

const LocationSection = () => {
  const { t, getLocalizedPath } = useLanguage();

  // Deliberately only the practical facts the numbered highlights above do not already
  // give. The beach and the restaurants are covered there, and repeating them here was
  // the kind of duplication this restructure exists to remove.
  const practical = [
    { icon: ShoppingBasket, label: t('location.shops'), body: t('location.shopsDesc') },
    { icon: Car, label: t('location.transport'), body: t('location.transportDesc') },
    { icon: Sailboat, label: 'Marina Nou Fontana', body: t('building.marina') },
  ];

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
          <div className="lg:col-span-5" data-reveal>
            <p className="eyebrow text-bone/50 mb-5">{t('paradise.eyebrow')}</p>
            <h2 className="display-lg text-bone">{t('paradise.title')}</h2>
          </div>

          <div className="lg:col-span-7 space-y-6" data-reveal>
            <p className="text-bone/80 font-light text-lg leading-relaxed">
              {t('paradise.description1')}
            </p>
            <p className="text-bone/70 font-light leading-relaxed">
              {t('paradise.description2')}
            </p>
          </div>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-14" data-reveal-stagger>
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

        {/* Practical distances — what guests check once they like the look of the place. */}
        <ul className="mt-20 pt-14 border-t border-white/16 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-14" data-reveal-stagger>
          {practical.map(({ icon: Icon, label, body }) => (
            <li key={label} className="hairline-dark py-6 grid grid-cols-[1.5rem_1fr] gap-x-4">
              <Icon className="w-[18px] h-[18px] text-brass mt-[3px]" strokeWidth={1.25} aria-hidden="true" />
              <div>
                <h3 className="font-sans text-[0.7rem] tracking-[0.18em] uppercase text-bone mb-2">
                  {label}
                </h3>
                <p className="text-bone/65 text-[0.9rem] font-light leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-20 pt-14 border-t border-white/16 grid lg:grid-cols-12 gap-y-10 gap-x-16" data-reveal>
          <div className="lg:col-span-5">
            <h3 className="font-display text-2xl md:text-3xl text-bone mb-4">
              {t('location.restaurantTitle')}
            </h3>
            <p className="text-bone/70 font-light leading-relaxed mb-8">
              {t('location.restaurantDesc')}
            </p>
            <a href={getLocalizedPath('/recommendations')} className="btn-on-dark">
              {t('location.viewRecommendations')}
            </a>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid grid-cols-2 gap-x-12">
              {WALKING_TIMES.map(({ name, minutes }) => (
                <li
                  key={name}
                  className="hairline-dark py-5 flex items-baseline justify-between gap-4"
                >
                  <span className="font-display text-xl text-bone">{name}</span>
                  <span className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-bone/50 whitespace-nowrap">
                    {minutes} {t('rec.location.walk')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;

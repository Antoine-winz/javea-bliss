import { useLanguage } from "@/contexts/LanguageContext";

/*
  A short signed note from the owner, after the reviews. Direct booking is the
  site's whole pitch, and a person saying it lands better than a feature list —
  the reviews above it name Laurent constantly, so the signature pays off.
*/
const HostNote = () => {
  const { t } = useLanguage();

  return (
    <section className="section bg-bone">
      <div className="shell-narrow text-center" data-reveal>
        <p className="eyebrow mb-8">{t('host.eyebrow')}</p>
        <blockquote className="font-display text-[1.6rem] md:text-[2rem] font-light leading-[1.45] text-ink mb-8">
          {t('host.text')}
        </blockquote>
        <p className="font-display italic text-xl text-brass">— {t('host.name')}</p>
      </div>
    </section>
  );
};

export default HostNote;

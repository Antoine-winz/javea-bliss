import { useLanguage } from "../contexts/LanguageContext";
import heroImage from "@assets/Xabia_playa_la_Grava_7H9A3912_20171206.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-end overflow-hidden">
      <img
        src={heroImage}
        alt="Arenal Beach and the Montgó above Jávea on the Costa Blanca"
        className="absolute inset-0 h-full w-full object-cover hero-drift"
        style={{ objectPosition: "center 65%" }}
        fetchPriority="high"
        width={2000}
        height={1333}
      />
      {/* Two scrims: one lifting off the bottom edge, one from the left. Together they
          darken only the corner the type occupies, so the photograph keeps its light. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, hsl(213 38% 8% / 0.85) 0%, hsl(213 38% 8% / 0.5) 32%, hsl(213 38% 8% / 0.15) 62%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, hsl(213 38% 8% / 0.6) 0%, hsl(213 38% 8% / 0.3) 38%, transparent 68%)",
        }}
      />

      <div className="relative shell px-6 md:px-10 pb-16 md:pb-24 w-full">
        <div className="max-w-3xl">
          <p className="eyebrow text-bone/70 mb-5 hero-rise">{t('hero.eyebrow')}</p>

          <h1 className="display-xl text-bone mb-6 hero-rise" style={{ '--rise-delay': '0.15s' } as React.CSSProperties}>
            {t('hero.subtitle')}
          </h1>

          <p
            className="text-bone/85 font-light text-lg md:text-xl max-w-xl leading-relaxed mb-10 hero-rise"
            style={{ '--rise-delay': '0.3s' } as React.CSSProperties}
          >
            {t('hero.tagline')}
          </p>

          <div
            className="flex flex-wrap items-center gap-4 hero-rise"
            style={{ '--rise-delay': '0.45s' } as React.CSSProperties}
          >
            <button onClick={() => scrollToSection("booking")} className="btn-on-dark">
              {t('hero.bookButton')}
            </button>
            <button
              onClick={() => scrollToSection("apartment")}
              className="link-underline text-bone/90 hover:text-bone"
            >
              {t('hero.exploreButton')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

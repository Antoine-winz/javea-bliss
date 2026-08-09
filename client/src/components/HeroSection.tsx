import { Button } from "@/components/ui/button";
import { useLanguage } from "../contexts/LanguageContext";
import heroImage from "@assets/Xabia_playa_la_Grava_7H9A3912_20171206.jpg";

const HeroSection = () => {
  const { t } = useLanguage();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80; // Height of the navigation bar
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      id="home" 
      className="pt-32 md:pt-28 relative h-screen flex items-center" 
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 70%"
      }}
    >
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="max-w-2xl bg-opacity-90 p-8 md:p-12 rounded-lg" style={{ backgroundColor: 'rgba(250, 247, 242, 0.9)' }}>
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-primary mb-2">{t('hero.title')}</h1>
          <p className="text-xl md:text-2xl mb-2 text-secondary">{t('hero.subtitle')}</p>
          <p className="text-lg md:text-xl mb-8 text-accent">{t('hero.tagline')}</p>
          <p className="mb-8 text-gray-700">
            {t('hero.description')}
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button 
              onClick={() => scrollToSection("booking")} 
              className="bg-accent hover:bg-secondary transition text-white font-montserrat font-semibold py-3 px-8 rounded-md"
            >
              {t('hero.bookButton')}
            </Button>
            <Button 
              onClick={() => scrollToSection("apartment")} 
              variant="outline"
              className="bg-transparent border-2 border-secondary hover:bg-secondary hover:text-white transition text-secondary font-montserrat font-semibold py-3 px-8 rounded-md"
            >
              {t('hero.exploreButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

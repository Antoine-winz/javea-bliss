import { useLanguage } from '@/contexts/LanguageContext';

const TrendingSection = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Why Javea in 2026?",
      subtitle: "Discover the lifestyle everyone is talking about.",
      remoteWork: "Remote Work Paradise",
      remoteWorkDesc: "600Mbps Fiber WiFi & ergonomic workspaces. Join the thriving digital nomad community just minutes away.",
      winterSun: "Winter Sun & Cycling",
      winterSunDesc: "With 300+ days of sun and 20°C winters, we are the perfect base for your cycling or hiking training.",
      renovation: "Home Renovation Stays",
      renovationDesc: "Bought a villa? Stay in luxury while you renovate. Special monthly rates for new homeowners."
    },
    nl: {
      title: "Waarom Javea in 2026?",
      subtitle: "Ontdek de levensstijl waar iedereen het over heeft.",
      remoteWork: "Thuiswerk Paradijs",
      remoteWorkDesc: "600Mbps glasvezel WiFi & ergonomische werkplekken. Sluit je aan bij de bloeiende digitale nomaden gemeenschap.",
      winterSun: "Winterzon & Fietsen",
      winterSunDesc: "Met 300+ zonnige dagen en 20°C winters zijn wij de perfecte uitvalsbasis voor je fiets- of wandeltraining.",
      renovation: "Verbouwing Verblijf",
      renovationDesc: "Villa gekocht? Verblijf in luxe tijdens de renovatie. Speciale maandtarieven voor nieuwe huiseigenaren."
    },
    fr: {
      title: "Pourquoi Javea en 2026?",
      subtitle: "Découvrez le style de vie dont tout le monde parle.",
      remoteWork: "Paradis du Télétravail",
      remoteWorkDesc: "WiFi Fibre 600Mbps & espaces de travail ergonomiques. Rejoignez la communauté florissante de nomades numériques.",
      winterSun: "Soleil d'Hiver & Cyclisme",
      winterSunDesc: "Avec 300+ jours de soleil et des hivers à 20°C, nous sommes la base parfaite pour votre entraînement cycliste ou randonnée.",
      renovation: "Séjours Rénovation",
      renovationDesc: "Vous avez acheté une villa? Séjournez dans le luxe pendant les travaux. Tarifs mensuels spéciaux pour les nouveaux propriétaires."
    },
    de: {
      title: "Warum Javea in 2026?",
      subtitle: "Entdecken Sie den Lifestyle, über den alle sprechen.",
      remoteWork: "Homeoffice Paradies",
      remoteWorkDesc: "600Mbps Glasfaser-WiFi & ergonomische Arbeitsplätze. Schließen Sie sich der blühenden Digital-Nomaden-Community an.",
      winterSun: "Wintersonne & Radfahren",
      winterSunDesc: "Mit 300+ Sonnentagen und 20°C Wintern sind wir die perfekte Basis für Ihr Rad- oder Wandertraining.",
      renovation: "Renovierungs-Aufenthalte",
      renovationDesc: "Villa gekauft? Wohnen Sie luxuriös während der Renovierung. Spezielle Monatstarife für neue Hausbesitzer."
    },
    es: {
      title: "¿Por qué Javea en 2026?",
      subtitle: "Descubre el estilo de vida del que todos hablan.",
      remoteWork: "Paraíso del Teletrabajo",
      remoteWorkDesc: "WiFi Fibra 600Mbps y espacios de trabajo ergonómicos. Únete a la próspera comunidad de nómadas digitales.",
      winterSun: "Sol de Invierno & Ciclismo",
      winterSunDesc: "Con más de 300 días de sol e inviernos de 20°C, somos la base perfecta para tu entrenamiento de ciclismo o senderismo.",
      renovation: "Estancias por Reformas",
      renovationDesc: "¿Compraste una villa? Alójate en el lujo mientras reformas. Tarifas mensuales especiales para nuevos propietarios."
    },
    it: {
      title: "Perché Javea nel 2026?",
      subtitle: "Scopri lo stile di vita di cui tutti parlano.",
      remoteWork: "Paradiso del Lavoro Remoto",
      remoteWorkDesc: "WiFi Fibra 600Mbps e spazi di lavoro ergonomici. Unisciti alla fiorente comunità di nomadi digitali.",
      winterSun: "Sole Invernale & Ciclismo",
      winterSunDesc: "Con oltre 300 giorni di sole e inverni a 20°C, siamo la base perfetta per il tuo allenamento ciclistico o escursionistico.",
      renovation: "Soggiorni per Ristrutturazione",
      renovationDesc: "Hai comprato una villa? Soggiorna nel lusso mentre ristrutturi. Tariffe mensili speciali per i nuovi proprietari."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <section className="py-12 bg-emerald-50" data-testid="section-trending-2025">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{t.title}</h2>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md" data-testid="card-remote-work">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2">{t.remoteWork}</h3>
            <p className="text-gray-600">{t.remoteWorkDesc}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md" data-testid="card-winter-sun">
            <div className="text-4xl mb-4">🚴‍♂️</div>
            <h3 className="text-xl font-bold mb-2">{t.winterSun}</h3>
            <p className="text-gray-600">{t.winterSunDesc}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md" data-testid="card-renovation">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-2">{t.renovation}</h3>
            <p className="text-gray-600">{t.renovationDesc}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;

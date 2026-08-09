import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import RecommendationsSEO from "@/components/RecommendationsSEO";
import { Link } from "wouter";

const Recommendations = () => {
  const { language, getLocalizedPath } = useLanguage();

  const translations = {
    en: {
      title: "Javea Insider Guide: Best Restaurants & Beach Clubs",
      subtitle: "Stay just steps away from Javea's most famous venues. No taxi needed.",
      walkMin: "min walk from Javea Bliss",
      stayNearby: "Stay Nearby",
      checkAvailability: "Check Apartment Availability",
      bookStay: "Book Your Stay",
      stay3Min: "Stay 3 Minutes Away",
      insiderTip: "Insider Tip",
      venues: {
        labambula: {
          name: "La Bambula",
          desc: "Famous for sunset cocktails and live music. The ultimate \"boho-chic\" spot in Javea.",
          tip: "Book a table on the terrace for 8 PM to catch the sunset. Then walk home to Javea Bliss in minutes."
        },
        chabada: {
          name: "Chabada",
          desc: "Located right on the Arenal promenade. Perfect for breakfast or evening cocktails with sea views."
        },
        lasiesta: {
          name: "La Siesta Beach Club",
          desc: "Ibiza vibes in Javea. Lounge on the rocks with a mojito right by the water."
        },
        bohemians: {
          name: "Bohemians",
          desc: "Elegant dining with a French touch. One of the most refined kitchens in the Arenal area."
        }
      }
    },
    nl: {
      title: "Javea Insider Gids: Beste Restaurants & Beachclubs",
      subtitle: "Verblijf op loopafstand van Javea's beroemdste locaties. Geen taxi nodig.",
      walkMin: "min lopen vanaf Javea Bliss",
      stayNearby: "Verblijf Dichtbij",
      checkAvailability: "Check Beschikbaarheid",
      bookStay: "Boek Je Verblijf",
      stay3Min: "Verblijf 3 Minuten Verderop",
      insiderTip: "Insider Tip",
      venues: {
        labambula: {
          name: "La Bambula",
          desc: "Beroemd om zonsondergang cocktails en live muziek. Dé ultieme \"boho-chic\" plek in Javea.",
          tip: "Reserveer een tafel op het terras om 20:00 voor de zonsondergang. Loop daarna in minuten terug naar Javea Bliss."
        },
        chabada: {
          name: "Chabada",
          desc: "Direct aan de Arenal boulevard. Perfect voor ontbijt of avondcocktails met zeezicht."
        },
        lasiesta: {
          name: "La Siesta Beach Club",
          desc: "Ibiza-sfeer in Javea. Loungen op de rotsen met een mojito direct aan het water."
        },
        bohemians: {
          name: "Bohemians",
          desc: "Elegante dining met een Frans tintje. Een van de meest verfijnde keukens in het Arenal gebied."
        }
      }
    },
    fr: {
      title: "Guide Insider Javea: Meilleurs Restaurants & Beach Clubs",
      subtitle: "Séjournez à quelques pas des lieux les plus célèbres de Javea. Pas besoin de taxi.",
      walkMin: "min à pied de Javea Bliss",
      stayNearby: "Séjourner à Proximité",
      checkAvailability: "Vérifier Disponibilité",
      bookStay: "Réserver Votre Séjour",
      stay3Min: "Séjourner à 3 Minutes",
      insiderTip: "Conseil d'Initié",
      venues: {
        labambula: {
          name: "La Bambula",
          desc: "Célèbre pour ses cocktails au coucher du soleil et sa musique live. L'endroit \"boho-chic\" ultime à Javea.",
          tip: "Réservez une table en terrasse pour 20h et admirez le coucher du soleil. Puis rentrez à pied à Javea Bliss en quelques minutes."
        },
        chabada: {
          name: "Chabada",
          desc: "Situé directement sur la promenade de l'Arenal. Parfait pour le petit-déjeuner ou les cocktails du soir avec vue mer."
        },
        lasiesta: {
          name: "La Siesta Beach Club",
          desc: "Ambiance Ibiza à Javea. Détendez-vous sur les rochers avec un mojito au bord de l'eau."
        },
        bohemians: {
          name: "Bohemians",
          desc: "Cuisine élégante avec une touche française. L'une des cuisines les plus raffinées de la zone Arenal."
        }
      }
    },
    de: {
      title: "Javea Insider Guide: Beste Restaurants & Beach Clubs",
      subtitle: "Wohnen Sie nur wenige Schritte von Javeas berühmtesten Locations entfernt. Kein Taxi nötig.",
      walkMin: "Min. zu Fuß von Javea Bliss",
      stayNearby: "In der Nähe Übernachten",
      checkAvailability: "Verfügbarkeit Prüfen",
      bookStay: "Aufenthalt Buchen",
      stay3Min: "3 Minuten Entfernt Übernachten",
      insiderTip: "Insider-Tipp",
      venues: {
        labambula: {
          name: "La Bambula",
          desc: "Berühmt für Sonnenuntergang-Cocktails und Live-Musik. Der ultimative \"Boho-Chic\" Spot in Javea.",
          tip: "Reservieren Sie einen Tisch auf der Terrasse für 20 Uhr zum Sonnenuntergang. Dann laufen Sie in Minuten zurück zu Javea Bliss."
        },
        chabada: {
          name: "Chabada",
          desc: "Direkt an der Arenal-Promenade. Perfekt für Frühstück oder Abend-Cocktails mit Meerblick."
        },
        lasiesta: {
          name: "La Siesta Beach Club",
          desc: "Ibiza-Vibes in Javea. Entspannen Sie auf den Felsen mit einem Mojito direkt am Wasser."
        },
        bohemians: {
          name: "Bohemians",
          desc: "Elegantes Dining mit französischem Touch. Eine der feinsten Küchen im Arenal-Gebiet."
        }
      }
    },
    es: {
      title: "Guía Insider de Javea: Mejores Restaurantes y Beach Clubs",
      subtitle: "Alójate a solo unos pasos de los locales más famosos de Javea. Sin necesidad de taxi.",
      walkMin: "min a pie desde Javea Bliss",
      stayNearby: "Alójate Cerca",
      checkAvailability: "Ver Disponibilidad",
      bookStay: "Reserva Tu Estancia",
      stay3Min: "Alójate a 3 Minutos",
      insiderTip: "Consejo de Experto",
      venues: {
        labambula: {
          name: "La Bambula",
          desc: "Famoso por sus cócteles al atardecer y música en vivo. El lugar \"boho-chic\" definitivo en Javea.",
          tip: "Reserva mesa en la terraza a las 20:00 para disfrutar del atardecer. Luego camina de vuelta a Javea Bliss en minutos."
        },
        chabada: {
          name: "Chabada",
          desc: "Ubicado en el paseo marítimo del Arenal. Perfecto para desayunos o cócteles nocturnos con vistas al mar."
        },
        lasiesta: {
          name: "La Siesta Beach Club",
          desc: "Vibraciones de Ibiza en Javea. Relájate en las rocas con un mojito junto al agua."
        },
        bohemians: {
          name: "Bohemians",
          desc: "Cocina elegante con toque francés. Una de las cocinas más refinadas de la zona del Arenal."
        }
      }
    },
    it: {
      title: "Guida Insider Javea: Migliori Ristoranti e Beach Club",
      subtitle: "Soggiorna a pochi passi dai locali più famosi di Javea. Nessun taxi necessario.",
      walkMin: "min a piedi da Javea Bliss",
      stayNearby: "Soggiorna Vicino",
      checkAvailability: "Verifica Disponibilità",
      bookStay: "Prenota il Tuo Soggiorno",
      stay3Min: "Soggiorna a 3 Minuti",
      insiderTip: "Consiglio dell'Esperto",
      venues: {
        labambula: {
          name: "La Bambula",
          desc: "Famoso per cocktail al tramonto e musica dal vivo. Il posto \"boho-chic\" definitivo a Javea.",
          tip: "Prenota un tavolo in terrazza per le 20:00 per ammirare il tramonto. Poi torna a Javea Bliss a piedi in pochi minuti."
        },
        chabada: {
          name: "Chabada",
          desc: "Situato sul lungomare dell'Arenal. Perfetto per colazione o cocktail serali con vista mare."
        },
        lasiesta: {
          name: "La Siesta Beach Club",
          desc: "Vibrazioni Ibiza a Javea. Rilassati sulle rocce con un mojito direttamente sull'acqua."
        },
        bohemians: {
          name: "Bohemians",
          desc: "Cucina elegante con tocco francese. Una delle cucine più raffinate nella zona Arenal."
        }
      }
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <RecommendationsSEO />
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 mt-16 md:mt-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center" data-testid="recommendations-title">
          {t.title}
        </h1>
        <p className="text-xl text-gray-600 text-center mb-12" data-testid="recommendations-subtitle">
          {t.subtitle}
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          
          <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100" data-testid="venue-labambula">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.venues.labambula.name}</h2>
              <p className="text-emerald-600 font-bold mb-4">🚶 6 {t.walkMin}</p>
              <p className="text-gray-600 mb-4">{t.venues.labambula.desc}</p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm"><strong>{t.insiderTip}:</strong> {t.venues.labambula.tip}</p>
              </div>
              <Link href={getLocalizedPath('/')} className="block text-center bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition-colors" data-testid="cta-labambula">
                {t.stayNearby}
              </Link>
            </div>
          </article>

          <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100" data-testid="venue-chabada">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.venues.chabada.name}</h2>
              <p className="text-emerald-600 font-bold mb-4">🚶 5 {t.walkMin}</p>
              <p className="text-gray-600 mb-4">{t.venues.chabada.desc}</p>
              <Link href={getLocalizedPath('/')} className="block text-center bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition-colors" data-testid="cta-chabada">
                {t.checkAvailability}
              </Link>
            </div>
          </article>

          <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100" data-testid="venue-lasiesta">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.venues.lasiesta.name}</h2>
              <p className="text-emerald-600 font-bold mb-4">🚶 8 {t.walkMin}</p>
              <p className="text-gray-600 mb-4">{t.venues.lasiesta.desc}</p>
              <Link href={getLocalizedPath('/')} className="block text-center bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition-colors" data-testid="cta-lasiesta">
                {t.bookStay}
              </Link>
            </div>
          </article>

          <article className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100" data-testid="venue-bohemians">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.venues.bohemians.name}</h2>
              <p className="text-emerald-600 font-bold mb-4">🚶 3 {t.walkMin}</p>
              <p className="text-gray-600 mb-4">{t.venues.bohemians.desc}</p>
              <Link href={getLocalizedPath('/')} className="block text-center bg-emerald-600 text-white font-bold py-2 rounded hover:bg-emerald-700 transition-colors" data-testid="cta-bohemians">
                {t.stay3Min}
              </Link>
            </div>
          </article>

        </div>
      </main>
    </div>
  );
};

export default Recommendations;

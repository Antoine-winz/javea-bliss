import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import { Link } from "wouter";

const Recommendations = () => {
  const { language, getLocalizedPath } = useLanguage();

  const translations = {
    en: {
      title: "Javea Insider Guide: Best Restaurants & Beach Clubs",
      subtitle: "Restaurants around Arenal Beach, plus La Siesta farther along the coast. Walking times are approximate.",
      walkMin: "min walk from Javea Bliss",
      farther: "Farther along the coast",
      stayNearby: "Stay Nearby",
      checkAvailability: "Check Apartment Availability",
      bookStay: "Book Your Stay",
      insiderTip: "Insider Tip",
      venues: {
        lafontana: { name: "La Fontana", desc: "Traditional Mediterranean cooking on the Arenal promenade: paella, fideuà and dishes for the whole family." },
        posidonia: { name: "Posidonia", desc: "Paella, fideuà and tapas overlooking Arenal Beach. A good option for a leisurely Mediterranean lunch." },
        ammos: { name: "Ammos", desc: "A casual beachfront stop for pizza, international dishes and a relaxed meal with sea views." },
        labambula: {
          name: "La Bambula",
          desc: "Famous for sunset cocktails and live music. The ultimate \"boho-chic\" spot in Javea.",
          tip: "Book ahead during busy periods and check the current live music programme before you go."
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
      subtitle: "Restaurants rond het Arenal-strand en La Siesta verder langs de kust. Looptijden zijn schattingen.",
      walkMin: "min lopen vanaf Javea Bliss",
      farther: "Verder langs de kust",
      stayNearby: "Verblijf Dichtbij",
      checkAvailability: "Check Beschikbaarheid",
      bookStay: "Boek Je Verblijf",
      insiderTip: "Insider Tip",
      venues: {
        lafontana: { name: "La Fontana", desc: "Traditionele mediterrane keuken aan de Arenal-boulevard: paella, fideuà en gerechten voor het hele gezin." },
        posidonia: { name: "Posidonia", desc: "Paella, fideuà en tapas met uitzicht op het Arenal-strand. Ideaal voor een ontspannen mediterrane lunch." },
        ammos: { name: "Ammos", desc: "Informeel eten aan het strand met pizza, internationale gerechten en zeezicht." },
        labambula: {
          name: "La Bambula",
          desc: "Beroemd om zonsondergang cocktails en live muziek. Dé ultieme \"boho-chic\" plek in Javea.",
          tip: "Reserveer in drukke periodes en bekijk het actuele programma met live muziek voordat je gaat."
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
      subtitle: "Restaurants autour de la plage de l’Arenal et La Siesta plus loin sur la côte. Les temps de marche sont approximatifs.",
      walkMin: "min à pied de Javea Bliss",
      farther: "Plus loin sur la côte",
      stayNearby: "Séjourner à Proximité",
      checkAvailability: "Vérifier Disponibilité",
      bookStay: "Réserver Votre Séjour",
      insiderTip: "Conseil d'Initié",
      venues: {
        lafontana: { name: "La Fontana", desc: "Cuisine méditerranéenne traditionnelle sur la promenade de l’Arenal : paella, fideuà et plats pour toute la famille." },
        posidonia: { name: "Posidonia", desc: "Paella, fideuà et tapas face à la plage de l’Arenal. Une belle adresse pour un déjeuner méditerranéen sans se presser." },
        ammos: { name: "Ammos", desc: "Une adresse décontractée en bord de plage pour des pizzas et des plats internationaux avec vue sur la mer." },
        labambula: {
          name: "La Bambula",
          desc: "Célèbre pour ses cocktails au coucher du soleil et sa musique live. L'endroit \"boho-chic\" ultime à Javea.",
          tip: "Réservez en période d’affluence et consultez le programme musical actuel avant de partir."
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
      subtitle: "Restaurants rund um den Arenal-Strand und La Siesta weiter entlang der Küste. Gehzeiten sind ungefähre Angaben.",
      walkMin: "Min. zu Fuß von Javea Bliss",
      farther: "Weiter entlang der Küste",
      stayNearby: "In der Nähe Übernachten",
      checkAvailability: "Verfügbarkeit Prüfen",
      bookStay: "Aufenthalt Buchen",
      insiderTip: "Insider-Tipp",
      venues: {
        lafontana: { name: "La Fontana", desc: "Traditionelle mediterrane Küche an der Arenal-Promenade: Paella, Fideuà und Gerichte für die ganze Familie." },
        posidonia: { name: "Posidonia", desc: "Paella, Fideuà und Tapas mit Blick auf den Arenal-Strand. Schön für ein entspanntes mediterranes Mittagessen." },
        ammos: { name: "Ammos", desc: "Ein entspanntes Lokal am Strand mit Pizza, internationalen Gerichten und Meerblick." },
        labambula: {
          name: "La Bambula",
          desc: "Berühmt für Sonnenuntergang-Cocktails und Live-Musik. Der ultimative \"Boho-Chic\" Spot in Javea.",
          tip: "Reservieren Sie in der Hochsaison und prüfen Sie vorher das aktuelle Musikprogramm."
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
      subtitle: "Restaurantes alrededor de la playa del Arenal y La Siesta más lejos por la costa. Los tiempos a pie son aproximados.",
      walkMin: "min a pie desde Javea Bliss",
      farther: "Más lejos por la costa",
      stayNearby: "Alójate Cerca",
      checkAvailability: "Ver Disponibilidad",
      bookStay: "Reserva Tu Estancia",
      insiderTip: "Consejo de Experto",
      venues: {
        lafontana: { name: "La Fontana", desc: "Cocina mediterránea tradicional en el paseo del Arenal: paella, fideuà y platos para toda la familia." },
        posidonia: { name: "Posidonia", desc: "Paella, fideuà y tapas frente a la playa del Arenal. Una buena opción para comer sin prisas junto al Mediterráneo." },
        ammos: { name: "Ammos", desc: "Un local informal frente al mar para disfrutar de pizzas, platos internacionales y vistas a la playa." },
        labambula: {
          name: "La Bambula",
          desc: "Famoso por sus cócteles al atardecer y música en vivo. El lugar \"boho-chic\" definitivo en Javea.",
          tip: "Reserva en temporada alta y consulta la programación de música en vivo antes de ir."
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
      subtitle: "Ristoranti intorno alla spiaggia dell’Arenal e La Siesta più avanti lungo la costa. I tempi a piedi sono indicativi.",
      walkMin: "min a piedi da Javea Bliss",
      farther: "Più avanti lungo la costa",
      stayNearby: "Soggiorna Vicino",
      checkAvailability: "Verifica Disponibilità",
      bookStay: "Prenota il Tuo Soggiorno",
      insiderTip: "Consiglio dell'Esperto",
      venues: {
        lafontana: { name: "La Fontana", desc: "Cucina mediterranea tradizionale sul lungomare dell’Arenal: paella, fideuà e piatti per tutta la famiglia." },
        posidonia: { name: "Posidonia", desc: "Paella, fideuà e tapas con vista sulla spiaggia dell’Arenal. Ideale per un pranzo mediterraneo senza fretta." },
        ammos: { name: "Ammos", desc: "Un locale informale sul mare per pizza, piatti internazionali e un pasto rilassato con vista sulla spiaggia." },
        labambula: {
          name: "La Bambula",
          desc: "Famoso per cocktail al tramonto e musica dal vivo. Il posto \"boho-chic\" definitivo a Javea.",
          tip: "Prenota nei periodi affollati e controlla il programma musicale aggiornato prima di andare."
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

  const venues = [
    { key: 'lafontana', minutes: 3, venue: t.venues.lafontana, cta: t.stayNearby, website: 'https://www.restaurantelafontana.es/' },
    { key: 'posidonia', minutes: 5, venue: t.venues.posidonia, cta: t.stayNearby, website: 'https://www.restauranteposidonia.com/' },
    { key: 'ammos', minutes: 7, venue: t.venues.ammos, cta: t.stayNearby, website: 'https://ammos.es/' },
    { key: 'labambula', minutes: 6, venue: t.venues.labambula, cta: t.stayNearby },
    { key: 'chabada', minutes: 5, venue: t.venues.chabada, cta: t.checkAvailability },
    { key: 'lasiesta', minutes: null, venue: t.venues.lasiesta, cta: t.bookStay },
    { key: 'bohemians', minutes: 6, venue: t.venues.bohemians, cta: t.stayNearby },
  ];

  return (
    <div className="min-h-screen bg-bone">
      <Navigation />

      <main className="section pt-32 md:pt-40">
        <div className="shell">
          <div className="grid lg:grid-cols-12 gap-y-8 gap-x-16 mb-16 md:mb-20">
            <div className="lg:col-span-7">
              <p className="eyebrow mb-5">{t.insiderTip}</p>
              <h1 className="display-lg" data-testid="recommendations-title">
                {t.title}
              </h1>
            </div>
            <div className="lg:col-span-5 flex items-end">
              <p className="lede" data-testid="recommendations-subtitle">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16">
            {venues.map(({ key, minutes, venue, cta, website }) => (
              <article
                key={key}
                className="border-t border-ink/12 py-10"
                data-testid={`venue-${key}`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
                  <h2 className="font-display text-3xl text-ink">{venue.name}</h2>
                  <span className="font-sans text-[0.75rem] tracking-[0.12em] uppercase text-brass whitespace-nowrap">
                    {minutes === null ? t.farther : `≈ ${minutes} ${t.walkMin}`}
                  </span>
                </div>

                <p className="text-[0.95rem] text-ink-soft leading-relaxed mb-6">{venue.desc}</p>

                {'tip' in venue && typeof venue.tip === "string" && (
                  <p className="text-[0.9rem] text-ink-soft leading-relaxed border-l border-brass pl-5 mb-6">
                    {venue.tip}
                  </p>
                )}

                {website && <a href={website} target="_blank" rel="noopener noreferrer" className="link-underline mr-6">{venue.name} ↗</a>}

                <Link
                  href={getLocalizedPath('/')}
                  className="link-underline"
                  data-testid={`cta-${key}`}
                >
                  {cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;

import { Star, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useState } from 'react';
import { useQuery } from "@tanstack/react-query";

interface GuestReview {
  id: number;
  guestName: string;
  country?: string;
  stayDate?: string;
  rating: number;
  reviewText: string;
  language: string;
  isVisible: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Live listing facts, checked August 2026: 5.0 overall from 15 reviews (100%
// five-star), Guest Favorite, Laurent is a Superhost. Update META when the
// listing changes — the badge must never claim more than the listing shows.
const AIRBNB_URL = 'https://www.airbnb.com/rooms/1437724898890828336';
const AIRBNB_META = { rating: '5.0', count: 15 };

const BADGE_LABELS: Record<string, { onAirbnb: string; reviews: string; superhost: string }> = {
  en: { onAirbnb: 'on Airbnb', reviews: 'reviews', superhost: 'Superhost' },
  nl: { onAirbnb: 'op Airbnb', reviews: 'beoordelingen', superhost: 'Superhost' },
  fr: { onAirbnb: 'sur Airbnb', reviews: 'avis', superhost: 'Superhôte' },
  it: { onAirbnb: 'su Airbnb', reviews: 'recensioni', superhost: 'Superhost' },
  de: { onAirbnb: 'auf Airbnb', reviews: 'Bewertungen', superhost: 'Superhost' },
  es: { onAirbnb: 'en Airbnb', reviews: 'reseñas', superhost: 'Superanfitrión' },
};

const REVIEW_LOCALES: Record<string, string> = {
  en: 'en-GB', nl: 'nl-NL', fr: 'fr-FR', it: 'it-IT', de: 'de-DE', es: 'es-ES',
};

const formatStay = (iso: string, language: string) => {
  const [y, m] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(REVIEW_LOCALES[language] || 'en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, 1));
};

interface AirbnbReview {
  id: number;
  guestName: string;
  stayISO: string;
  texts: Record<string, string>;
}

/*
  Reviews taken verbatim from the Airbnb listing (as displayed in English there),
  lightly copy-edited and translated for the other site languages. Airbnb shows
  them machine-translated too, so no "original" toggle for these. Deduped at
  render time against the site's own review database by guest name.
*/
const AIRBNB_REVIEWS: AirbnbReview[] = [
  {
    id: -1,
    guestName: 'Ailyssa',
    stayISO: '2026-08',
    texts: {
      en: "This place is a dream. The apartment is spacious and perfectly equipped, down to the smallest details — a bucket and spade, umbrellas and towels for the beach. The beach is a stone's throw away and Laurent recommended perfect spots for us to eat. We loved every moment and were sad to go!",
      nl: 'Dit appartement is een droom. Ruim en tot in de kleinste details uitgerust — zelfs een emmertje en schepje, parasols en strandhanddoeken. Het strand ligt op een steenworp afstand en Laurent gaf ons perfecte eettips. We hebben van elk moment genoten en vonden het jammer om te vertrekken!',
      fr: "Cet endroit est un rêve. L'appartement est spacieux et parfaitement équipé, jusqu'aux moindres détails — seau et pelle, parasols et serviettes de plage. La plage est à deux pas et Laurent nous a recommandé de très bonnes adresses. Nous avons adoré chaque instant, tristes de repartir !",
      it: "Questo posto è un sogno. L'appartamento è spazioso e attrezzato alla perfezione, fin nei minimi dettagli — secchiello e paletta, ombrelloni e teli mare. La spiaggia è a due passi e Laurent ci ha consigliato posti perfetti dove mangiare. Ci è dispiaciuto andare via!",
      de: 'Diese Wohnung ist ein Traum. Geräumig und bis ins kleinste Detail ausgestattet — sogar Eimer und Schaufel, Sonnenschirme und Strandtücher. Der Strand ist einen Steinwurf entfernt, und Laurent hatte perfekte Restauranttipps. Wir haben jeden Moment genossen!',
      es: 'Este sitio es un sueño. El apartamento es amplio y está equipado hasta el último detalle — cubo y pala, sombrillas y toallas para la playa. La playa está a un paso y Laurent nos recomendó sitios perfectos para comer. ¡Nos dio pena irnos!',
    },
  },
  {
    id: -2,
    guestName: 'Noé',
    stayISO: '2026-08',
    texts: {
      en: "We loved the experience. We'll do it again. A 10-star host.",
      nl: 'We vonden het geweldig. Dit doen we nog een keer. Een host met tien sterren.',
      fr: 'Nous avons adoré. Nous reviendrons. Un hôte dix étoiles.',
      it: "Un'esperienza bellissima. La ripeteremo. Un host da dieci stelle.",
      de: 'Wir waren begeistert. Das machen wir wieder. Ein Gastgeber mit zehn Sternen.',
      es: 'Nos encantó la experiencia. Repetiremos. Un anfitrión de diez estrellas.',
    },
  },
  {
    id: -3,
    guestName: 'Ana',
    stayISO: '2026-04',
    texts: {
      en: "Laurent has been a great host. We spent beautiful days as a family and the stay couldn't have been better — clean, perfect location, two minutes' walk from the beach, surrounded by restaurants. He even left us beach towels. We'll be back for sure!",
      nl: 'Laurent was een geweldige gastheer. We hebben prachtige dagen met het gezin gehad en het verblijf had niet beter gekund — schoon, perfecte ligging, twee minuten lopen van het strand, omringd door restaurants. Hij had zelfs strandhanddoeken voor ons klaargelegd. We komen zeker terug!',
      fr: "Laurent a été un hôte formidable. De très belles journées en famille, un séjour parfait — propre, très bien situé, à deux minutes à pied de la plage, entouré de restaurants. Il nous a même laissé des serviettes de plage. Nous reviendrons, c'est sûr !",
      it: 'Laurent è stato un ottimo host. Giorni bellissimi in famiglia, un soggiorno perfetto — pulito, posizione ideale, a due minuti a piedi dalla spiaggia, circondato da ristoranti. Ci ha lasciato persino i teli mare. Torneremo di sicuro!',
      de: 'Laurent war ein großartiger Gastgeber. Wunderschöne Tage mit der Familie, der Aufenthalt hätte nicht besser sein können — sauber, perfekte Lage, zwei Gehminuten zum Strand, Restaurants ringsum. Er hat uns sogar Strandtücher dagelassen. Wir kommen sicher wieder!',
      es: 'Laurent ha sido un anfitrión estupendo. Pasamos unos días preciosos en familia y la estancia no pudo ser mejor — limpio, ubicación perfecta, a dos minutos andando de la playa y rodeado de restaurantes. Hasta nos dejó toallas de playa. ¡Volveremos seguro!',
    },
  },
  {
    id: -4,
    guestName: 'Víctor',
    stayISO: '2026-07',
    texts: {
      en: 'A very friendly host, willing to help at any time of day, and an apartment with every possible amenity.',
      nl: 'Een heel vriendelijke gastheer die op elk moment van de dag wilde helpen, en een appartement met werkelijk alle voorzieningen.',
      fr: 'Un hôte très sympathique, prêt à aider à toute heure, et un logement doté de tout le confort possible.',
      it: 'Un host gentilissimo, disponibile a qualsiasi ora, e un alloggio con ogni comfort possibile.',
      de: 'Ein sehr freundlicher Gastgeber, der zu jeder Tageszeit half, und eine Wohnung mit wirklich jeder Annehmlichkeit.',
      es: 'Un anfitrión muy amable, dispuesto a ayudar a cualquier hora, y un alojamiento con todas las comodidades posibles.',
    },
  },
  {
    id: -5,
    guestName: 'Marcos',
    stayISO: '2026-07',
    texts: {
      en: 'The apartment is spectacular — new, very well equipped and clean. Perfect location a few metres from the beach. Laurent kept checking whether we were comfortable or needed anything.',
      nl: 'Het appartement is spectaculair — nieuw, zeer goed uitgerust en schoon. Perfecte ligging op een paar meter van het strand. Laurent vroeg steeds of alles naar wens was en of we iets nodig hadden.',
      fr: "L'appartement est spectaculaire — neuf, très bien équipé et propre. Emplacement parfait à quelques mètres de la plage. Laurent prenait régulièrement des nouvelles pour savoir si tout allait bien.",
      it: "L'appartamento è spettacolare — nuovo, attrezzatissimo e pulito. Posizione perfetta a pochi metri dalla spiaggia. Laurent ci ha scritto per sapere se andava tutto bene e se ci servisse qualcosa.",
      de: 'Die Wohnung ist spektakulär — neu, sehr gut ausgestattet und sauber. Perfekte Lage, wenige Meter vom Strand. Laurent fragte immer wieder, ob alles passt und ob wir etwas brauchen.',
      es: 'El apartamento es espectacular — nuevo, muy bien equipado y limpio. Ubicación perfecta a pocos metros de la playa. Laurent estuvo pendiente de nosotros por si necesitábamos algo.',
    },
  },
  {
    id: -6,
    guestName: 'Brandon',
    stayISO: '2025-09',
    texts: {
      en: "Laurent was amazing — when we had a problem with our previous place he made sure everything was perfect for our stay. He met us at check-in with a bottle of champagne, answered quickly and gave us great recommendations. We'll definitely book again.",
      nl: 'Laurent was geweldig — toen we een probleem hadden met ons vorige adres zorgde hij dat alles perfect geregeld was. Hij stond bij het inchecken klaar met een fles champagne, reageerde snel en gaf goede tips. We boeken zeker weer.',
      fr: "Laurent a été formidable — après un souci avec notre logement précédent, il a veillé à ce que tout soit parfait. Il nous a accueillis avec une bouteille de champagne, répondait vite et donnait d'excellents conseils. Nous réserverons à nouveau.",
      it: 'Laurent è stato eccezionale — dopo un problema con il nostro alloggio precedente, ha fatto in modo che tutto fosse perfetto. Ci ha accolti con una bottiglia di champagne, rispondeva subito e ci ha dato ottimi consigli. Prenoteremo di nuovo.',
      de: 'Laurent war großartig — nach einem Problem mit unserer vorherigen Unterkunft sorgte er dafür, dass alles perfekt war. Er empfing uns mit einer Flasche Champagner, antwortete schnell und gab tolle Empfehlungen. Wir buchen sicher wieder.',
      es: 'Laurent fue increíble — tras un problema con nuestro alojamiento anterior, se aseguró de que todo estuviera perfecto. Nos recibió con una botella de champán, respondía rapidísimo y nos dio muy buenas recomendaciones. Sin duda repetiremos.',
    },
  },
  {
    id: -7,
    guestName: 'Maria',
    stayISO: '2025-09',
    texts: {
      en: "The apartment is brand new — super comfortable beds, a full kitchen, beach towels, they even left food in the fridge. Two minutes' walk from the sandy beach, with everything you need to relax or go out. Laurent left us a restaurant guide for the area. We'd come back without hesitation.",
      nl: 'Het appartement is splinternieuw — supercomfortabele bedden, een complete keuken, strandhanddoeken, er lag zelfs eten in de koelkast. Twee minuten lopen van het zandstrand, met alles om te ontspannen of uit te gaan. Laurent liet een restaurantgids voor de buurt achter. We komen zonder twijfel terug.',
      fr: "L'appartement est flambant neuf — lits très confortables, cuisine complète, serviettes de plage, il y avait même de quoi manger dans le frigo. À deux minutes à pied de la plage de sable, avec tout ce qu'il faut pour se détendre ou sortir. Laurent nous a laissé un guide des restaurants du quartier. Nous reviendrons sans hésiter.",
      it: "L'appartamento è nuovissimo — letti comodissimi, cucina completa, teli mare, persino qualcosa da mangiare in frigo. A due minuti a piedi dalla spiaggia di sabbia, con tutto quello che serve per rilassarsi o uscire. Laurent ci ha lasciato una guida ai ristoranti della zona. Torneremmo senza pensarci.",
      de: 'Die Wohnung ist nagelneu — superbequeme Betten, komplette Küche, Strandtücher, sogar etwas zu essen im Kühlschrank. Zwei Gehminuten vom Sandstrand, mit allem, was man zum Entspannen oder Ausgehen braucht. Laurent hinterließ uns einen Restaurantführer fürs Viertel. Wir kämen jederzeit wieder.',
      es: 'El apartamento está completamente nuevo — camas comodísimas, cocina completa, toallas de playa, hasta comida en la nevera. A dos minutos andando de la playa de arena, con todo para relajarse o salir… tú decides. Laurent nos dejó una guía de restaurantes de la zona. Volveríamos sin dudarlo.',
    },
  },
  {
    id: -8,
    guestName: 'Carlos',
    stayISO: '2025-07',
    texts: {
      en: "One of the most complete Airbnbs I've stayed in — renovated, with full kitchenware, linens, towels, even cooking ingredients. Ideal location close to the beach and restaurants. Unbeatable service from Laurent.",
      nl: "Een van de meest complete Airbnb's waar ik ooit verbleef — gerenoveerd, met volledig keukengerei, beddengoed, handdoeken en zelfs kookingrediënten. Ideale ligging bij het strand en de restaurants. Onverslaanbare service van Laurent.",
      fr: "L'un des Airbnb les plus complets où j'aie séjourné — rénové, avec toute la vaisselle, le linge, les serviettes et même des ingrédients de cuisine. Emplacement idéal près de la plage et des restaurants. Service imbattable de Laurent.",
      it: 'Uno degli Airbnb più completi in cui abbia mai soggiornato — ristrutturato, con stoviglie complete, biancheria, asciugamani e persino gli ingredienti per cucinare. Posizione ideale vicino a spiaggia e ristoranti. Servizio imbattibile da parte di Laurent.',
      de: 'Eines der bestausgestatteten Airbnbs, in denen ich je war — renoviert, mit komplettem Küchenzubehör, Bettwäsche, Handtüchern und sogar Kochzutaten. Ideale Lage nahe Strand und Restaurants. Unschlagbarer Service von Laurent.',
      es: 'Uno de los Airbnb más completos en los que he estado — reformado, con utensilios de cocina, sábanas, toallas e incluso ingredientes para cocinar. Ubicación ideal cerca de la playa y los restaurantes. Atención inmejorable de Laurent.',
    },
  },
];

const TestimonialsSection = () => {
  const { t, language } = useLanguage();
  const [showOriginal, setShowOriginal] = useState<{[key: number]: boolean}>({});
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });
  
  // Fetch visible reviews from the database
  const { data: reviews = [] } = useQuery<GuestReview[]>({
    queryKey: ["/api/reviews/visible"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Database reviews (owner-managed via the admin panel), then the Airbnb set —
  // deduped by guest name so a review imported into the database never shows twice.
  const dbReviews = reviews.filter((review) => review.isVisible);
  const dbNames = new Set(dbReviews.map((r) => r.guestName.trim().toLowerCase().split(' ')[0]));
  const airbnbCards = AIRBNB_REVIEWS.filter(
    (r) => !dbNames.has(r.guestName.trim().toLowerCase().split(' ')[0])
  ).map((r) => ({
    id: r.id,
    guestName: r.guestName,
    country: undefined as string | undefined,
    stayDate: formatStay(r.stayISO, language),
    rating: 5,
    reviewText: r.texts[language] || r.texts.en,
    language,
    isVisible: true,
    isVerified: true,
    isAirbnb: true,
  }));
  const displayReviews = [
    ...airbnbCards,
    ...dbReviews.map((r) => ({ ...r, isAirbnb: false })),
  ];

  const badge = BADGE_LABELS[language] || BADGE_LABELS.en;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={i < rating ? "fill-current" : "text-ink/15"}
        size={13}
      />
    ));
  };

  // Enhanced translation function with better translations for all reviews
  const translateText = (text: string, fromLang: string, toLang: string) => {
    if (fromLang === toLang) return text;
    
    // Complete translations for all reviews in both directions
    const translations: {[key: string]: {[key: string]: string}} = {
      'en': {
        // Spanish reviews to English
        'Uno de los Airbnb s más completos en los que he estado, reformado, con utensilios de cocina completos, sábanas, toallas, ingredientes de cocina. Muy contentos con nuestra estadía en el piso, fuimos en familia a pasar el fin de semana. Ideal ubicación cerca de la playa y de restaurantes. Inmejorable atención de Laurent.': 'One of the most complete Airbnbs I have stayed in, renovated, with complete kitchen utensils, sheets, towels, cooking ingredients. Very happy with our stay in the apartment, we went as a family to spend the weekend. Ideal location near the beach and restaurants. Unbeatable attention from Laurent.',
        
        'Una estancia perfecta. Muy buena ubicación. Laurent un excelente anfitrión.': 'A perfect stay. Very good location. Laurent an excellent host.',
        
        'Hemos estado muy cómodos y Laurent es muy amable.': 'We have been very comfortable and Laurent is very kind.',
        
        'Laurent ha sido un anfitrión de 10.\nLa casa está andando a 2 minutos de la playa.\nNos compró comida y bebida para las vacaciones. Tenía la casa recién reformada y olía a nueva. \nNos atendió en la llegada desde bien pronto, muchas gracias.': 'Laurent has been a 10/10 host.\nThe house is a 2-minute walk from the beach.\nHe bought us food and drinks for the holidays. The house was recently renovated and smelled new.\nHe attended to us upon arrival very early, thank you very much.',
        
        'Laurent nos recibió y estuvo pendiente hasta nuestra llegada. \nEl apartamento completamente nuevo , camas súper cómodas,cocina completa, toallas para la playa,incluso nos dejó comida en la nevera. Todos a 2 minutos andando de la playa del arenal, donde encuentras de Todo para pasar unos días de relax o de fiesta … tu decides. \nLaurent nos dejó una guía de restaurantes de la zona y nos indicó sitios cercanos donde pasar unos días fantásticos. \nRepetiremos sin duda .': 'Laurent welcomed us and was attentive until our arrival.\nThe apartment completely new, super comfortable beds, full kitchen, beach towels, he even left food in the fridge. All 2 minutes walking from Arenal beach, where you find everything to spend a few days relaxing or partying... you decide.\nLaurent left us a guide of restaurants in the area and pointed out nearby places to spend some fantastic days.\nWe will definitely repeat.',
        
        'Laurent fue súper amable en todo momento.\nSúper atento y pendiente en todo momento de nosotros. \nEl apartamento maravilloso, súper limpio. \nLas camas cómodisimas para el descanso. Ubicación excelente': 'Laurent was super kind at all times.\nSuper attentive and caring at all times with us.\nThe apartment wonderful, super clean.\nThe beds very comfortable for resting. Excellent location',
        
        'Anfitrión muy amable, pendiente de los huéspedes y de los detalles, piso muy bien equipado y lleno de detalles.': 'Very friendly host, attentive to guests and details, apartment very well equipped and full of thoughtful touches.',
        
        // French reviews to English
        'Un endroit exceptionnel, à seulement 3 minutes de la plage et entouré des meilleurs restaurants et bars de Javea. La vie nocturne est si proche que vous n\'aurez besoin que de vos jambes pour vous y rendre. L\'appartement est tout neuf. La cuisine est entièrement équipée pour cuisiner et l\'hôte nous a même accueillis avec une bouteille de Cava !': 'An exceptional place, just 3 minutes from the beach and surrounded by Javea\'s best restaurants and bars. The nightlife is so close that you\'ll only need your legs to get there. The apartment is brand new. The kitchen is fully equipped for cooking and the host even welcomed us with a bottle of Cava!'
      },
      'es': {
        // English reviews to Spanish
        'One of the most complete Airbnbs I have stayed in, renovated, with complete kitchen utensils, sheets, towels, cooking ingredients. Very happy with our stay on the floor, we went as a family to spend the weekend. Ideal location near the beach and restaurants. Unbeatable attention from Laurent.': 'Uno de los Airbnb más completos en los que me he alojado, renovado, con utensilios de cocina completos, sábanas, toallas, ingredientes para cocinar. Muy contentos con nuestra estancia en el piso, fuimos en familia a pasar el fin de semana. Ubicación ideal cerca de la playa y restaurantes. Atención inmejorable de Laurent.',
        
        'We found exactly what we were looking for — affordable luxury within walking distance to the beach. The terrace, beautifully lit at sunset, became our favorite spot to relax. Great value for money and impeccably clean.': 'Encontramos exactamente lo que buscábamos: lujo asequible a poca distancia de la playa. La terraza, bellamente iluminada al atardecer, se convirtió en nuestro lugar favorito para relajarnos. Excelente relación calidad-precio e impecablemente limpio.',
        
        'An exceptional place, truly just 3 minutes from the beach and surrounded by Javea\'s best restaurants and bars. The nightlife is so close that walking is the only option you\'ll need. The apartment strikes the perfect balance between comfort and affordability. The kitchen is fully equipped for home cooking, and the host even welcomed us with a bottle of sparkling wine (cava).': 'Un lugar excepcional, realmente a solo 3 minutos de la playa y rodeado de los mejores restaurantes y bares de Jávea. La vida nocturna está tan cerca que caminar será la única opción que necesitarás. El apartamento logra el equilibrio perfecto entre comodidad y asequibilidad. La cocina está totalmente equipada para cocinar en casa, y el anfitrión incluso nos recibió con una botella de vino espumoso (cava).',
        
        'Laurent was amazing and when we had a problem with our last Bnb he made sure everything was perfect for our stay. He met us to check in with a bottle of champagne! He is very responsive and gave us recommendations for things to do. When we come back we will definitely book his place again.': 'Laurent fue increíble y cuando tuvimos un problema con nuestro último Bnb, se aseguró de que todo fuera perfecto para nuestra estadía. ¡Nos recibió en el check-in con una botella de champán! Es muy receptivo y nos dio recomendaciones de cosas para hacer. Cuando volvamos, definitivamente reservaremos su lugar de nuevo.',
        
        // French reviews to Spanish
        'Un endroit exceptionnel, à seulement 3 minutes de la plage et entouré des meilleurs restaurants et bars de Javea. La vie nocturne est si proche que vous n\'aurez besoin que de vos jambes pour vous y rendre. L\'appartement est tout neuf. La cuisine est entièrement équipée pour cuisiner et l\'hôte nous a même accueillis avec une bouteille de Cava !': 'Un lugar excepcional, a solo 3 minutos de la playa y rodeado de los mejores restaurantes y bares de Javea. La vida nocturna está tan cerca que solo necesitarás tus piernas para llegar. El apartamento es completamente nuevo. La cocina está totalmente equipada para cocinar y el anfitrión incluso nos recibió con una botella de Cava!',
        
        // Add Spanish to Spanish (for non-English to Spanish translations)
        'Une estancia perfecta. Muy buena ubicación. Laurent un excelente anfitrión.': 'Una estancia perfecta. Muy buena ubicación. Laurent un excelente anfitrión.',
        'Hemos estado muy cómodos y Laurent es muy amable.': 'Hemos estado muy cómodos y Laurent es muy amable.',
        'Laurent ha sido un anfitrión de 10.\nLa casa está andando a 2 minutos de la playa.\nNos compró comida y bebida para las vacaciones. Tenía la casa recién reformada y olía a nueva. \nNos atendió en la llegada desde bien pronto, muchas gracias.': 'Laurent ha sido un anfitrión de 10.\nLa casa está andando a 2 minutos de la playa.\nNos compró comida y bebida para las vacaciones. Tenía la casa recién reformada y olía a nueva. \nNos atendió en la llegada desde bien pronto, muchas gracias.'
      },
      'fr': {
        // English reviews to French
        'One of the most complete Airbnbs I have stayed in, renovated, with complete kitchen utensils, sheets, towels, cooking ingredients. Very happy with our stay on the floor, we went as a family to spend the weekend. Ideal location near the beach and restaurants. Unbeatable attention from Laurent.': 'L\'un des Airbnb les plus complets où j\'ai séjourné, rénové, avec des ustensiles de cuisine complets, draps, serviettes, ingrédients de cuisine. Très heureux de notre séjour dans l\'appartement, nous sommes venus en famille passer le week-end. Emplacement idéal près de la plage et des restaurants. Attention imbattable de Laurent.',
        
        'We found exactly what we were looking for — affordable luxury within walking distance to the beach. The terrace, beautifully lit at sunset, became our favorite spot to relax. Great value for money and impeccably clean.': 'Nous avons trouvé exactement ce que nous cherchions — un luxe abordable à distance de marche de la plage. La terrasse, magnifiquement éclairée au coucher du soleil, est devenue notre endroit favori pour nous détendre. Excellent rapport qualité-prix et impeccablement propre.',
        
        'An exceptional place, just 3 minutes from the beach and surrounded by Javea\'s best restaurants and bars. The nightlife is so close that you\'ll only need your legs to get there. The apartment is brand new. The kitchen is fully equipped for cooking and the host even welcomed us with a bottle of Cava!': 'Un endroit exceptionnel, à seulement 3 minutes de la plage et entouré des meilleurs restaurants et bars de Javea. La vie nocturne est si proche que vous n\'aurez besoin que de vos jambes pour vous y rendre. L\'appartement est tout neuf. La cuisine est entièrement équipée pour cuisiner et l\'hôte nous a même accueillis avec une bouteille de Cava !',
        
        // Spanish reviews to French  
        'Uno de los Airbnb s más completos en los que he estado, reformado, con utensilios de cocina completos, sábanas, toallas, ingredientes de cocina. Muy contentos con nuestra estadía en el piso, fuimos en familia a pasar el fin de semana. Ideal ubicación cerca de la playa y de restaurantes. Inmejorable atención de Laurent.': 'L\'un des Airbnb les plus complets où j\'ai séjourné, rénové, avec des ustensiles de cuisine complets, draps, serviettes, ingrédients de cuisine. Très heureux de notre séjour dans l\'appartement, nous sommes venus en famille passer le week-end. Emplacement idéal près de la plage et des restaurants. Attention imbattable de Laurent.',
        
        'Una estancia perfecta. Muy buena ubicación. Laurent un excelente anfitrión.': 'Un séjour parfait. Très bon emplacement. Laurent un excellent hôte.',
        
        'Hemos estado muy cómodos y Laurent es muy amable.': 'Nous avons été très à l\'aise et Laurent est très aimable.',
        
        'Laurent ha sido un anfitrión de 10.\nLa casa está andando a 2 minutos de la playa.\nNos compró comida y bebida para las vacaciones. Tenía la casa recién reformada y olía a nueva. \nNos atendió en la llegada desde bien pronto, muchas gracias.': 'Laurent a été un hôte de 10/10.\nLa maison est à 2 minutes à pied de la plage.\nIl nous a acheté de la nourriture et des boissons pour les vacances. La maison était récemment rénovée et sentait le neuf.\nIl nous a accueillis dès notre arrivée très tôt, merci beaucoup.',
        
        'Laurent nos recibió y estuvo pendiente hasta nuestra llegada. \nEl apartamento completamente nuevo , camas súper cómodas,cocina completa, toallas para la playa,incluso nos dejó comida en la nevera. Todos a 2 minutos andando de la playa del arenal, donde encuentras de Todo para pasar unos días de relax o de fiesta … tu decides. \nLaurent nos dejó una guía de restaurantes de la zona y nos indicó sitios cercanos donde pasar unos días fantásticos. \nRepetiremos sin duda .': 'Laurent nous a accueillis et a été attentif jusqu\'à notre arrivée.\nL\'appartement entièrement neuf, lits super confortables, cuisine complète, serviettes de plage, il a même laissé de la nourriture dans le réfrigérateur. Tous à 2 minutes à pied de la plage d\'Arenal, où vous trouverez de tout pour passer des jours de détente ou de fête... vous décidez.\nLaurent nous a laissé un guide des restaurants de la région et nous a indiqué des endroits à proximité pour passer des jours fantastiques.\nNous reviendrons sans aucun doute.',
        
        'Laurent fue súper amable en todo momento.\nSúper atento y pendiente en todo momento de nosotros. \nEl apartamento maravilloso, súper limpio. \nLas camas cómodisimas para el descanso. Ubicación excelente': 'Laurent a été super gentil à tout moment.\nSuper attentif et attentionné à tout moment avec nous.\nL\'appartement merveilleux, super propre.\nLes lits très confortables pour le repos. Emplacement excellent',
        
        'Anfitrión muy amable, pendiente de los huéspedes y de los detalles, piso muy bien equipado y lleno de detalles.': 'Hôte très aimable, attentif aux invités et aux détails, appartement très bien équipé et plein d\'attention.',
        
        // English reviews to French
        'Laurent was amazing and when we had a problem with our last Bnb he made sure everything was perfect for our stay. He met us to check in with a bottle of champagne! He is very responsive and gave us recommendations for things to do. When we come back we will definitely book his place again.': 'Laurent était incroyable et quand nous avons eu un problème avec notre dernier Bnb, il s\'est assuré que tout était parfait pour notre séjour. Il nous a accueillis à l\'enregistrement avec une bouteille de champagne! Il est très réactif et nous a donné des recommandations de choses à faire. Quand nous reviendrons, nous réserverons certainement son logement à nouveau.'
      },
      'nl': {
        // English reviews to Dutch
        'One of the most complete Airbnbs I have stayed in, renovated, with complete kitchen utensils, sheets, towels, cooking ingredients. Very happy with our stay on the floor, we went as a family to spend the weekend. Ideal location near the beach and restaurants. Unbeatable attention from Laurent.': 'Een van de meest complete Airbnb\'s waar ik heb verbleven, gerenoveerd, met complete keukenbenodigdheden, lakens, handdoeken, kookingrediënten. Zeer tevreden met ons verblijf in het appartement, we gingen als familie het weekend doorbrengen. Ideale locatie nabij het strand en restaurants. Onverslaanbare aandacht van Laurent.',
        
        'We found exactly what we were looking for — affordable luxury within walking distance to the beach. The terrace, beautifully lit at sunset, became our favorite spot to relax. Great value for money and impeccably clean.': 'We vonden precies wat we zochten — betaalbare luxe op loopafstand van het strand. Het terras, prachtig verlicht bij zonsondergang, werd onze favoriete plek om te ontspannen. Uitstekende prijs-kwaliteitverhouding en onberispelijk schoon.',
        
        'An exceptional place, just 3 minutes from the beach and surrounded by Javea\'s best restaurants and bars. The nightlife is so close that you\'ll only need your legs to get there. The apartment is brand new. The kitchen is fully equipped for cooking and the host even welcomed us with a bottle of Cava!': 'Een uitzonderlijke plek, slechts 3 minuten van het strand en omringd door Javea\'s beste restaurants en bars. Het nachtleven is zo dichtbij dat je alleen je benen nodig hebt om er te komen. Het appartement is gloednieuw. De keuken is volledig uitgerust om te koken en de gastheer verwelkomde ons zelfs met een fles Cava!',
        
        // French reviews to Dutch
        'Un endroit exceptionnel, à seulement 3 minutes de la plage et entouré des meilleurs restaurants et bars de Javea. La vie nocturne est si proche que vous n\'aurez besoin que de vos jambes pour vous y rendre. L\'appartement est tout neuf. La cuisine est entièrement équipée pour cuisiner et l\'hôte nous a même accueillis avec une bouteille de Cava !': 'Een uitzonderlijke plek, slechts 3 minuten van het strand en omringd door Javea\'s beste restaurants en bars. Het nachtleven is zo dichtbij dat je alleen je benen nodig hebt om er te komen. Het appartement is gloednieuw. De keuken is volledig uitgerust om te koken en de gastheer verwelkomde ons zelfs met een fles Cava!',
        
        // Spanish reviews to Dutch
        'Uno de los Airbnb s más completos en los que he estado, reformado, con utensilios de cocina completos, sábanas, toallas, ingredientes de cocina. Muy contentos con nuestra estadía en el piso, fuimos en familia a pasar el fin de semana. Ideal ubicación cerca de la playa y de restaurantes. Inmejorable atención de Laurent.': 'Een van de meest complete Airbnb\'s waar ik ben geweest, gerenoveerd, met complete keukenbenodigdheden, lakens, handdoeken, kookingrediënten. Zeer tevreden met ons verblijf in het appartement, we gingen met het gezin een weekend weg. Ideale locatie nabij het strand en restaurants. Onverslaanbare aandacht van Laurent.',
        
        'Una estancia perfecta. Muy buena ubicación. Laurent un excelente anfitrión.': 'Een perfect verblijf. Zeer goede locatie. Laurent een uitstekende gastheer.',
        
        'Hemos estado muy cómodos y Laurent es muy amable.': 'We zijn erg op ons gemak geweest en Laurent is erg vriendelijk.',
        
        'Laurent ha sido un anfitrión de 10.\nLa casa está andando a 2 minutos de la playa.\nNos compró comida y bebida para las vacaciones. Tenía la casa recién reformada y olía a nueva. \nNos atendió en la llegada desde bien pronto, muchas gracias.': 'Laurent is een 10/10 gastheer geweest.\nHet huis ligt op 2 minuten lopen van het strand.\nHij kocht eten en drinken voor ons voor de vakantie. Het huis was onlangs gerenoveerd en rook nieuw.\nHij begroette ons bij aankomst heel vroeg, heel erg bedankt.',
        
        'Laurent nos recibió y estuvo pendiente hasta nuestra llegada. \nEl apartamento completamente nuevo , camas súper cómodas,cocina completa, toallas para la playa,incluso nos dejó comida en la nevera. Todos a 2 minutos andando de la playa del arenal, donde encuentras de Todo para pasar unos días de relax o de fiesta … tu decides. \nLaurent nos dejó una guía de restaurantes de la zona y nos indicó sitios cercanos donde pasar unos días fantásticos. \nRepetiremos sin duda .': 'Laurent verwelkomde ons en was attent tot onze aankomst.\nHet appartement volledig nieuw, super comfortabele bedden, volledige keuken, strandhanddoeken, hij liet zelfs eten achter in de koelkast. Alles op 2 minuten lopen van het Arenal-strand, waar je alles vindt om een paar dagen te ontspannen of te feesten... jij beslist.\nLaurent liet ons een gids van restaurants in de omgeving achter en wees ons op nabijgelegen plekken om een paar fantastische dagen door te brengen.\nWe komen zeker terug.',
        
        'Laurent fue súper amable en todo momento.\nSúper atento y pendiente en todo momento de nosotros. \nEl apartamento maravilloso, súper limpio. \nLas camas cómodisimas para el descanso. Ubicación excelente': 'Laurent was super vriendelijk op alle momenten.\nSuper attent en zorgzaam op alle momenten met ons.\nHet appartement geweldig, super schoon.\nDe bedden zeer comfortabel om uit te rusten. Uitstekende locatie',
        
        'Anfitrión muy amable, pendiente de los huéspedes y de los detalles, piso muy bien equipado y lleno de detalles.': 'Zeer vriendelijke gastheer, attent voor gasten en details, appartement zeer goed uitgerust en vol met attente details.',
        
        // English reviews to Dutch
        'Laurent was amazing and when we had a problem with our last Bnb he made sure everything was perfect for our stay. He met us to check in with a bottle of champagne! He is very responsive and gave us recommendations for things to do. When we come back we will definitely book his place again.': 'Laurent was geweldig en toen we een probleem hadden met onze laatste Bnb zorgde hij ervoor dat alles perfect was voor ons verblijf. Hij ontmoette ons bij het inchecken met een fles champagne! Hij is zeer responsief en gaf ons aanbevelingen voor dingen om te doen. Als we terugkomen, zullen we zijn plek zeker weer boeken.',
        
        // French reviews to Dutch  
        'Un endroit exceptionnel, vraiment à seulement 3 minutes de la plage et entouré des meilleurs restaurants et bars de Jávea. La vie nocturne est si proche que la marche sera la seule option dont vous aurez besoin. L\'appartement trouve l\'équilibre parfait entre confort et prix abordable. La cuisine est entièrement équipée pour cuisiner à la maison, et l\'hôte nous a même accueillis avec une bouteille de vin mousseux (cava).': 'Een uitzonderlijke plek, werkelijk slechts 3 minuten van het strand en omringd door Jávea\'s beste restaurants en bars. Het nachtleven is zo dichtbij dat wandelen de enige optie is die je nodig hebt. Het appartement vindt de perfecte balans tussen comfort en betaalbaarheid. De keuken is volledig uitgerust om thuis te koken, en de gastheer verwelkomde ons zelfs met een fles mousserende wijn (cava).'
      },
      'de': {
        // English reviews to German
        'One of the most complete Airbnbs I have stayed in, renovated, with complete kitchen utensils, sheets, towels, cooking ingredients. Very happy with our stay on the floor, we went as a family to spend the weekend. Ideal location near the beach and restaurants. Unbeatable attention from Laurent.': 'Eines der vollständigsten Airbnbs, in denen ich übernachtet habe, renoviert, mit kompletten Küchenutensilien, Bettwäsche, Handtüchern, Kochzutaten. Sehr zufrieden mit unserem Aufenthalt in der Wohnung, wir gingen als Familie, um das Wochenende zu verbringen. Ideale Lage in der Nähe des Strandes und der Restaurants. Unschlagbare Aufmerksamkeit von Laurent.',
        
        'We found exactly what we were looking for — affordable luxury within walking distance to the beach. The terrace, beautifully lit at sunset, became our favorite spot to relax. Great value for money and impeccably clean.': 'Wir fanden genau das, was wir suchten — erschwinglicher Luxus in Gehweite zum Strand. Die Terrasse, wunderschön beleuchtet bei Sonnenuntergang, wurde unser Lieblingsplatz zum Entspannen. Ausgezeichnetes Preis-Leistungs-Verhältnis und tadellos sauber.',
        
        'An exceptional place, just 3 minutes from the beach and surrounded by Javea\'s best restaurants and bars. The nightlife is so close that you\'ll only need your legs to get there. The apartment is brand new. The kitchen is fully equipped for cooking and the host even welcomed us with a bottle of Cava!': 'Ein außergewöhnlicher Ort, nur 3 Minuten vom Strand entfernt und umgeben von Javeas besten Restaurants und Bars. Das Nachtleben ist so nah, dass Sie nur Ihre Beine brauchen, um dorthin zu gelangen. Die Wohnung ist brandneu. Die Küche ist vollständig zum Kochen ausgestattet und der Gastgeber begrüßte uns sogar mit einer Flasche Cava!',
        
        // French reviews to German
        'Un endroit exceptionnel, à seulement 3 minutes de la plage et entouré des meilleurs restaurants et bars de Javea. La vie nocturne est si proche que vous n\'aurez besoin que de vos jambes pour vous y rendre. L\'appartement est tout neuf. La cuisine est entièrement équipée pour cuisiner et l\'hôte nous a même accueillis avec une bouteille de Cava !': 'Ein außergewöhnlicher Ort, nur 3 Minuten vom Strand entfernt und umgeben von Javeas besten Restaurants und Bars. Das Nachtleben ist so nah, dass Sie nur Ihre Beine brauchen, um dorthin zu gelangen. Die Wohnung ist brandneu. Die Küche ist vollständig zum Kochen ausgestattet und der Gastgeber begrüßte uns sogar mit einer Flasche Cava!',
        
        // Spanish reviews to German
        'Uno de los Airbnb s más completos en los que he estado, reformado, con utensilios de cocina completos, sábanas, toallas, ingredientes de cocina. Muy contentos con nuestra estadía en el piso, fuimos en familia a pasar el fin de semana. Ideal ubicación cerca de la playa y de restaurantes. Inmejorable atención de Laurent.': 'Eines der vollständigsten Airbnbs, in denen ich übernachtet habe, renoviert, mit kompletten Küchenutensilien, Bettwäsche, Handtüchern, Kochzutaten. Sehr zufrieden mit unserem Aufenthalt in der Wohnung, wir gingen als Familie, um das Wochenende zu verbringen. Ideale Lage in der Nähe des Strandes und der Restaurants. Unschlagbare Aufmerksamkeit von Laurent.',
        
        'Una estancia perfecta. Muy buena ubicación. Laurent un excelente anfitrión.': 'Ein perfekter Aufenthalt. Sehr gute Lage. Laurent ein ausgezeichneter Gastgeber.',
        
        'Hemos estado muy cómodos y Laurent es muy amable.': 'Wir haben uns sehr wohl gefühlt und Laurent ist sehr freundlich.',
        
        'Laurent ha sido un anfitrión de 10.\nLa casa está andando a 2 minutos de la playa.\nNos compró comida y bebida para las vacaciones. Tenía la casa recién reformada y olía a nueva. \nNos atendió en la llegada desde bien pronto, muchas gracias.': 'Laurent war ein 10/10 Gastgeber.\nDas Haus ist 2 Minuten zu Fuß vom Strand entfernt.\nEr kaufte uns Essen und Getränke für den Urlaub. Das Haus war kürzlich renoviert und roch neu.\nEr empfing uns bei der Ankunft sehr früh, vielen Dank.',
        
        'Laurent nos recibió y estuvo pendiente hasta nuestra llegada. \nEl apartamento completamente nuevo , camas súper cómodas,cocina completa, toallas para la playa,incluso nos dejó comida en la nevera. Todos a 2 minutos andando de la playa del arenal, donde encuentras de Todo para pasar unos días de relax o de fiesta … tu decides. \nLaurent nos dejó una guía de restaurantes de la zona y nos indicó sitios cercanos donde pasar unos días fantásticos. \nRepetiremos sin duda .': 'Laurent begrüßte uns und war aufmerksam bis zu unserer Ankunft.\nDie Wohnung komplett neu, super bequeme Betten, komplette Küche, Strandhandtücher, er ließ sogar Essen im Kühlschrank. Alles 2 Minuten zu Fuß vom Arenal-Strand, wo Sie alles finden, um ein paar Tage zu entspannen oder zu feiern... Sie entscheiden.\nLaurent hinterließ uns einen Restaurantführer der Gegend und zeigte uns nahegelegene Orte, um ein paar fantastische Tage zu verbringen.\nWir werden auf jeden Fall wiederkommen.',
        
        'Laurent fue súper amable en todo momento.\nSúper atento y pendiente en todo momento de nosotros. \nEl apartamento maravilloso, súper limpio. \nLas camas cómodisimas para el descanso. Ubicación excelente': 'Laurent war zu jeder Zeit super freundlich.\nSuper aufmerksam und fürsorglich zu jeder Zeit mit uns.\nDie Wohnung wunderbar, super sauber.\nDie Betten sehr bequem zum Ausruhen. Ausgezeichnete Lage',
        
        'Anfitrión muy amable, pendiente de los huéspedes y de los detalles, piso muy bien equipado y lleno de detalles.': 'Sehr freundlicher Gastgeber, aufmerksam gegenüber Gästen und Details, Wohnung sehr gut ausgestattet und voller aufmerksamer Details.',
        
        // English reviews to German
        'Laurent was amazing and when we had a problem with our last Bnb he made sure everything was perfect for our stay. He met us to check in with a bottle of champagne! He is very responsive and gave us recommendations for things to do. When we come back we will definitely book his place again.': 'Laurent war großartig und als wir ein Problem mit unserem letzten Bnb hatten, stellte er sicher, dass alles perfekt für unseren Aufenthalt war. Er empfing uns beim Check-in mit einer Flasche Champagner! Er ist sehr reaktionsschnell und gab uns Empfehlungen für Aktivitäten. Wenn wir zurückkommen, werden wir seinen Platz auf jeden Fall wieder buchen.'
      }
    };
    
    // Find exact translation match first
    if (translations[toLang] && translations[toLang][text]) {
      return translations[toLang][text];
    }
    
    // If no exact match, try partial translations for fallback
    let translatedText = text;
    if (translations[toLang]) {
      Object.entries(translations[toLang]).forEach(([original, translated]) => {
        if (text.includes(original)) {
          translatedText = translatedText.replace(original, translated);
        }
      });
    }
    
    return translatedText;
  };

  const toggleOriginal = (reviewId: number) => {
    setShowOriginal(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // No loading or empty branch: the Airbnb set is static, so the section always
  // has content, and database reviews slot in when the API responds.
  return (
    <section className="section bg-sand">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-8 gap-x-16 mb-14 md:mb-16 items-end" data-reveal>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">{t('testimonials.eyebrow')}</p>
            <h2 className="display-lg mb-5">{t('testimonials.title')}</h2>

            {/* Verified from the live listing — see AIRBNB_META above. */}
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 group"
              data-testid="airbnb-rating-badge"
            >
              <span className="flex gap-1 text-brass self-center" aria-hidden="true">
                {renderStars(5)}
              </span>
              <span className="font-sans text-[0.9375rem] text-ink">
                {AIRBNB_META.rating} {badge.onAirbnb}
              </span>
              <span className="font-sans text-[0.8125rem] text-stone">
                {AIRBNB_META.count} {badge.reviews} · {badge.superhost}
              </span>
              <span className="font-sans text-[0.8125rem] text-stone underline underline-offset-4 decoration-stone/40 group-hover:decoration-ink group-hover:text-ink transition">
                airbnb.com
              </span>
            </a>
          </div>

          <div className="lg:col-span-5 flex lg:justify-end gap-3">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 border border-ink/20 flex items-center justify-center text-ink hover:bg-ink hover:text-bone transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 border border-ink/20 flex items-center justify-center text-ink hover:bg-ink hover:text-bone transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef} data-reveal>
          <div className="flex">
            {displayReviews.map((review) => (
              <div key={review.id} className="flex-none w-full md:w-1/2 lg:w-1/3 pr-6 md:pr-10">
                <figure className="h-full flex flex-col border-t border-ink/12 pt-8">
                  <div className="flex gap-1 mb-6 text-brass">{renderStars(review.rating)}</div>

                  <blockquote className="flex-1">
                    <p className="font-display text-[1.375rem] leading-[1.45] text-ink">
                      {showOriginal[review.id]
                        ? review.reviewText
                        : translateText(review.reviewText, review.language, language)}
                    </p>
                  </blockquote>

                  {/* Airbnb entries are already shown translated on Airbnb itself,
                      so there is no "original" to toggle to. */}
                  {!review.isAirbnb && (
                    <button
                      onClick={() => toggleOriginal(review.id)}
                      className="mt-5 self-start inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.08em] uppercase text-stone hover:text-ink transition-colors"
                      data-testid={`button-toggle-original-${review.id}`}
                    >
                      <Globe className="w-3 h-3" />
                      {showOriginal[review.id]
                        ? t('reviews.hideOriginal').replace('{lang}', review.language.toUpperCase())
                        : t('reviews.showOriginal').replace('{lang}', review.language.toUpperCase())}
                    </button>
                  )}

                  <figcaption className="mt-8 pt-5 border-t border-ink/10">
                    <p className="font-sans text-[0.9375rem] text-ink">{review.guestName}</p>
                    <p className="font-sans text-[0.8125rem] text-stone mt-0.5">
                      {[review.country, review.stayDate, review.isAirbnb ? 'Airbnb' : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

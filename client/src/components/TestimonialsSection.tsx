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
  const { data: reviews = [], isLoading } = useQuery<GuestReview[]>({
    queryKey: ["/api/reviews/visible"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Show all visible reviews regardless of language
  const displayReviews = reviews.filter(review => review.isVisible);

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

  if (isLoading) {
    return (
      <section className="py-16 bg-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-2">{t('testimonials.title')}</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-4"></div>
            <p className="max-w-3xl mx-auto text-gray-700">{t('testimonials.description')}</p>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-600">Loading guest reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayReviews.length === 0) {
    return (
      <section className="section bg-sand">
        <div className="shell">
          <p className="eyebrow mb-5">{t('testimonials.eyebrow')}</p>
          <h2 className="display-lg mb-6">{t('testimonials.title')}</h2>
          <p className="lede">{t('testimonials.description')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-sand">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-8 gap-x-16 mb-14 md:mb-16 items-end" data-reveal>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">{t('testimonials.eyebrow')}</p>
            <h2 className="display-lg">{t('testimonials.title')}</h2>
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

                  <figcaption className="mt-8 pt-5 border-t border-ink/10">
                    <p className="font-sans text-[0.9375rem] text-ink">{review.guestName}</p>
                    <p className="font-sans text-[0.8125rem] text-stone mt-0.5">
                      {[review.country, review.stayDate].filter(Boolean).join(' · ')}
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

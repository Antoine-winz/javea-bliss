import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface PromotionalOffer {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
  startDate: string;
  endDate: string;
  validUntil: string;
  isActive: boolean;
}

const OptimizedSEOStrategy = () => {
  const { language } = useLanguage();
  
  // Fetch promotional offers for dynamic SEO
  const { data: promotionalOffers } = useQuery({
    queryKey: ["/api/promotional-offers"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Find active promotional offers
  const activeOffers = (promotionalOffers as PromotionalOffer[] || []).filter((offer: PromotionalOffer) => {
    if (!offer.isActive) return false;
    const now = new Date();
    const validUntil = new Date(offer.validUntil);
    return now <= validUntil;
  });

  // Get the best offer (highest discount percentage)
  const bestOffer = activeOffers.length > 0 ? activeOffers.reduce((best: PromotionalOffer, current: PromotionalOffer) => 
    current.discountPercentage > best.discountPercentage ? current : best
  ) : null;

  // Calculate days remaining for offer
  const daysRemaining = bestOffer ? Math.ceil((new Date(bestOffer.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const updateMetaTags = (seo: any) => {
    // Update title (dynamic based on promotional offers)
    document.title = seo.title;
    
    // Update or create meta tags
    const updateOrCreateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Core meta tags
    updateOrCreateMeta('description', seo.description);
    updateOrCreateMeta('keywords', seo.keywords);
    
    // Geographic and location meta tags
    updateOrCreateMeta('geo.region', 'ES-VC');
    updateOrCreateMeta('geo.placename', 'Jávea');
    updateOrCreateMeta('geo.position', '38.7906;0.1754');
    updateOrCreateMeta('ICBM', '38.7906, 0.1754');
    updateOrCreateMeta('destination', 'Jávea Costa Blanca Spain');
    updateOrCreateMeta('vacation-type', 'Beach Holiday Mediterranean');
    updateOrCreateMeta('accommodation-type', 'Vacation Rental Apartment');
    updateOrCreateMeta('geo-targeting', seo.geoTargeting);
    
    // Weather-specific meta tags
    updateOrCreateMeta('weather-location', 'Jávea, Costa Blanca, Spain');
    updateOrCreateMeta('weather-keywords', seo.weatherKeywords);
    updateOrCreateMeta('climate-info', 'Mediterranean climate, sunny weather, beach destination');
    
    // Tourism meta tags
    updateOrCreateMeta('tourism-keywords', seo.tourismKeywords);
    updateOrCreateMeta('dining-keywords', seo.restaurantKeywords);
    updateOrCreateMeta('beach-keywords', seo.beachKeywords);
    
    // Open Graph tags
    updateOrCreateMeta('og:title', seo.title, true);
    updateOrCreateMeta('og:description', seo.description, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:locale', language === 'it' ? 'it_IT' : language === 'fr' ? 'fr_FR' : language === 'nl' ? 'nl_NL' : language === 'de' ? 'de_DE' : 'en_US', true);
    updateOrCreateMeta('og:site_name', 'Jávea Bliss', true);

    // Promotional meta tags (only when there's an active offer)
    if (bestOffer) {
      updateOrCreateMeta('promotional-offer', `${bestOffer.discountPercentage}% OFF`);
      updateOrCreateMeta('promotional-price', `€${bestOffer.discountedPrice}/night`);
      updateOrCreateMeta('promotional-expires', bestOffer.validUntil);
    }

    // Add comprehensive structured data
    const addStructuredData = (id: string, data: any) => {
      let script = document.querySelector(`script[data-id="${id}"]`) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-id', id);
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    // Main accommodation structured data
    addStructuredData('accommodation', {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Jávea Bliss - Luxury Coastal Apartment",
      "description": seo.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jávea",
        "addressRegion": "Valencia", 
        "addressCountry": "Spain",
        "streetAddress": "Near Arenal Beach"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.7906,
        "longitude": 0.1754
      },
      "url": window.location.href,
      "amenityFeature": [
        {"@type": "LocationFeatureSpecification", "name": "WiFi"},
        {"@type": "LocationFeatureSpecification", "name": "Air Conditioning"},
        {"@type": "LocationFeatureSpecification", "name": "Kitchen"},
        {"@type": "LocationFeatureSpecification", "name": "Balcony"},
        {"@type": "LocationFeatureSpecification", "name": "Near Beach"}
      ],
      "starRating": {
        "@type": "Rating",
        "ratingValue": 5
      },
      "priceRange": bestOffer ? `€${bestOffer.discountedPrice}-€${bestOffer.originalPrice}` : "€130-€200"
    });

    // Tourist attraction structured data
    addStructuredData('tourist-attraction', {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Jávea Costa Blanca Tourism",
      "description": "Discover Jávea's beaches, restaurants, and Mediterranean lifestyle",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jávea",
        "addressRegion": "Valencia",
        "addressCountry": "Spain"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.7906,
        "longitude": 0.1754
      },
      "touristType": ["Beach Tourism", "Cultural Tourism", "Gastronomic Tourism"]
    });

    // Weather place structured data
    addStructuredData('weather-place', {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": "Jávea Weather & Climate Information",
      "description": "Mediterranean climate with over 300 days of sunshine annually",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Jávea",
        "addressRegion": "Valencia",
        "addressCountry": "Spain"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 38.7906,
        "longitude": 0.1754
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Climate Type",
          "value": "Mediterranean"
        },
        {
          "@type": "PropertyValue", 
          "name": "Average Temperature",
          "value": "18-28°C"
        },
        {
          "@type": "PropertyValue",
          "name": "Annual Sunshine Days",
          "value": "300+"
        }
      ]
    });

    // Promotional offer structured data (if active)
    if (bestOffer) {
      addStructuredData('promotional-offer', {
        "@context": "https://schema.org",
        "@type": "Offer",
        "name": `Jávea Apartment - ${bestOffer.discountPercentage}% Discount`,
        "description": seo.promotionalDescription,
        "price": bestOffer.discountedPrice,
        "priceCurrency": "EUR",
        "priceValidUntil": bestOffer.validUntil,
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "validThrough": bestOffer.validUntil,
        "seller": {
          "@type": "Organization",
          "name": "Jávea Bliss"
        },
        "itemOffered": {
          "@type": "Accommodation",
          "name": "Luxury Coastal Apartment Jávea",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jávea",
            "addressCountry": "ES"
          }
        }
      });
    }
  };

  useEffect(() => {
    const seo = getSEOContent();
    updateMetaTags(seo);
  }, [language, bestOffer]);

  const getSEOContent = () => {
    const baseContent = getBaseSEOContent();
    const promotionalContent = bestOffer ? getPromotionalSEOContent() : null;
    
    return {
      ...baseContent,
      title: promotionalContent?.title || baseContent.title,
      description: promotionalContent?.description || baseContent.description,
      keywords: promotionalContent ? `${promotionalContent.keywords}, ${baseContent.keywords}` : baseContent.keywords,
      promotionalDescription: promotionalContent?.description
    };
  };

  const getPromotionalSEOContent = () => {
    if (!bestOffer) return null;
    
    const promotionalContent = {
      en: {
        title: `🔥 ${bestOffer.discountPercentage}% OFF Jávea Apartment - ${daysRemaining} Days Left!`,
        description: `Limited time offer! Save ${bestOffer.discountPercentage}% on luxury coastal apartment in Jávea. From €${bestOffer.discountedPrice}/night. Book now - offer expires in ${daysRemaining} days!`,
        keywords: `jávea discount ${bestOffer.discountPercentage}%, costa blanca offer, spain apartment deal, arenal beach discount, last minute booking jávea, €${bestOffer.discountedPrice} jávea, vacation rental promotion`
      },
      it: {
        title: `🔥 ${bestOffer.discountPercentage}% SCONTO Appartamento Jávea - ${daysRemaining} Giorni Rimasti!`,
        description: `Offerta a tempo limitato! Risparmia ${bestOffer.discountPercentage}% su appartamento costiero di lusso a Jávea. Da €${bestOffer.discountedPrice}/notte. Prenota ora - l'offerta scade tra ${daysRemaining} giorni!`,
        keywords: `jávea sconto ${bestOffer.discountPercentage}%, offerta costa blanca, appartamento spagna offerta, spiaggia arenal sconto, prenotazione last minute jávea, €${bestOffer.discountedPrice} jávea, promozione affitto vacanze`
      },
      fr: {
        title: `🔥 ${bestOffer.discountPercentage}% RÉDUCTION Appartement Jávea - ${daysRemaining} Jours Restants!`,
        description: `Offre à durée limitée ! Économisez ${bestOffer.discountPercentage}% sur appartement côtier de luxe à Jávea. À partir de €${bestOffer.discountedPrice}/nuit. Réservez maintenant - l'offre expire dans ${daysRemaining} jours !`,
        keywords: `jávea réduction ${bestOffer.discountPercentage}%, offre costa blanca, appartement espagne promotion, plage arenal réduction, réservation dernière minute jávea, €${bestOffer.discountedPrice} jávea, promotion location vacances`
      },
      nl: {
        title: `🔥 ${bestOffer.discountPercentage}% KORTING Jávea Appartement - ${daysRemaining} Dagen Over!`,
        description: `Beperkte tijd aanbieding! Bespaar ${bestOffer.discountPercentage}% op luxe kustappartement in Jávea. Vanaf €${bestOffer.discountedPrice}/nacht. Boek nu - aanbieding verloopt over ${daysRemaining} dagen!`,
        keywords: `jávea korting ${bestOffer.discountPercentage}%, costa blanca aanbieding, spanje appartement deal, arenal strand korting, last minute booking jávea, €${bestOffer.discountedPrice} jávea, vakantieverhuur promotie`
      },
      de: {
        title: `🔥 ${bestOffer.discountPercentage}% RABATT Jávea Apartment - ${daysRemaining} Tage Übrig!`,
        description: `Zeitlich begrenzte Angebot! Sparen Sie ${bestOffer.discountPercentage}% auf Luxus-Küstenapartment in Jávea. Ab €${bestOffer.discountedPrice}/Nacht. Jetzt buchen - Angebot läuft in ${daysRemaining} Tagen ab!`,
        keywords: `jávea rabatt ${bestOffer.discountPercentage}%, costa blanca angebot, spanien apartment deal, arenal strand rabatt, last minute buchung jávea, €${bestOffer.discountedPrice} jávea, ferienvermietung promotion`
      },
      es: {
        title: `🔥 ${bestOffer.discountPercentage}% DESCUENTO Apartamento Jávea - ¡${daysRemaining} Días Restantes!`,
        description: `¡Oferta por tiempo limitado! Ahorra ${bestOffer.discountPercentage}% en apartamento costero de lujo en Jávea. Desde €${bestOffer.discountedPrice}/noche. ¡Reserva ahora - la oferta expira en ${daysRemaining} días!`,
        keywords: `jávea descuento ${bestOffer.discountPercentage}%, oferta costa blanca, apartamento españa oferta, playa arenal descuento, reserva última hora jávea, €${bestOffer.discountedPrice} jávea, promoción alquiler vacacional`
      }
    };

    return promotionalContent[language as keyof typeof promotionalContent] || promotionalContent.en;
  };

  const getBaseSEOContent = () => {
    switch (language) {
      case 'it':
        return {
          title: 'Jávea Appartamento Vacanze - Meteo, Spiaggia Arenal, Costa Blanca Spagna',
          description: 'Scopri Jávea con il nostro appartamento vacanze. Informazioni meteo, spiagge, ristoranti. A 3 minuti dalla Spiaggia Arenal. Prenotazione diretta da €130/notte.',
          keywords: 'jávea, javea, meteo jávea, clima jávea, spiaggia arenal, costa blanca, appartamento vacanze, affitto jávea, vacanze jávea, spagna, valencia, turismo spagna, vacanze costa blanca, affitto estate spagna, appartamenti turistici valencia, costa mediterranea spagna, spiagge valencia, turismo valencia, vacanze famiglie spagna, weekend valencia, ponti spagna, vacanze pasqua spagna, estate costa blanca, turismo spagna, vacanze nazionali, appartamenti vacanze alicante, chabada jávea, la bambula, ristoranti jávea, meteo jávea oggi, previsioni jávea, montañar, granadella, sardinera',
          weatherKeywords: 'meteo jávea oggi, previsioni jávea, clima costa blanca, temperatura jávea, sole jávea, meteorologia valencia, meteo alicante, clima mediterraneo spagna, meteo valencia',
          beachKeywords: 'spiaggia arenal jávea, migliori spiagge jávea, spiaggia montañar, cala granadella, spiagge costa blanca, bandiere blu valencia, spiagge pulite spagna, cala sardinera',
          restaurantKeywords: 'ristoranti jávea, chabada jávea, la bambula, dove mangiare jávea, gastronomia valenciana, ristoranti costa blanca, ristoranti pesce jávea, masena jávea, bohemians jávea',
          tourismKeywords: 'turismo jávea, cosa fare jávea, cosa vedere jávea, attività jávea, escursioni jávea, capo la nao, montgó, parco naturale, escursionismo jávea, immersioni jávea, sport acquatici',
          geoTargeting: 'italia roma milano napoli torino palermo genova bologna firenze bari catania venezia verona messina padova trieste taranto brescia parma modena reggio calabria reggio emilia perugia ravenna livorno cagliari foggia rimini salerno ferrara sassari latina giugliano monza siracusa pescara bergamo forli vicenza trento terni bolzano novara piacenza andria udine arezzo cesena lecce pesaro barletta la spezia alessandria pistoia catanzaro pisa brindisi ancona como'
        };
      case 'fr':
        return {
          title: 'Jávea Appartement Vacances - Météo, Plage Arenal, Costa Blanca Espagne',
          description: 'Découvrez Jávea avec notre appartement de vacances. Informations météo, plages, restaurants. À 3 minutes de Plage Arenal. Réservation directe dès 130€/nuit.',
          keywords: 'jávea, javea, météo jávea, climat jávea, plage arenal, costa blanca, appartement vacances, location jávea, vacances jávea, espagne, valencia, vacances espagne, location vacances espagne, appartement espagne, costa blanca location, vacances costa del sol, tourisme espagne, séjour espagne, vacances été espagne, location saisonnière espagne, week-end espagne, escapade espagne, vacances pâques espagne, pont mai espagne, vacances juillet août espagne, résidence vacances espagne, villa espagne, maison vacances espagne, appartement touristique valencie, chabada jávea, la bambula, restaurants jávea, météo jávea aujourd\'hui, montañar, granadella, sardinera',
          weatherKeywords: 'météo jávea aujourd\'hui, prévisions jávea, climat costa blanca, température jávea, soleil jávea, météo valencia, temps alicante, climat méditerranéen espagne, prévisions météo costa blanca',
          beachKeywords: 'plage arenal jávea, meilleures plages jávea, plage montañar, cala granadella, plages costa blanca, pavillon bleu valencia, plages propres espagne, côte méditerranéenne, cala sardinera',
          restaurantKeywords: 'restaurants jávea, chabada jávea, la bambula, où manger jávea, gastronomie valencienne, restaurants costa blanca, fruits de mer jávea, paella valencie, masena jávea, bohemians jávea',
          tourismKeywords: 'tourisme jávea, que faire jávea, que voir jávea, activités jávea, excursions jávea, cap la nao, montgó, parc naturel, randonnée jávea, plongée jávea, sports nautiques',
          geoTargeting: 'france paris lyon marseille toulouse nice nantes strasbourg montpellier bordeaux lille rennes reims nancy orleans tours limoges clermont ferrand dijon amiens perpignan brest angers nimes nancy metz toulon grenoble angoulême poitiers caen belgique bruxelles anvers gand charleroi liège bruges namur leuven mons courtrai hasselt ostende suisse genève zürich bâle berne lausanne winterthur lucerne fribourg neuchâtel sion quebec montreal ottawa toronto vancouver calgary edmonton winnipeg quebec city gatineau sherbrooke trois-rivières chicoutimi drummondville granby saint-jean shawinigan rimouski baie-comeau sept-iles alma mont-laurier val-dor amos rouyn-noranda'
        };
      case 'nl':
        return {
          title: 'Jávea Vakantieappartement - Weer, Arenal Strand, Costa Blanca Spanje',
          description: 'Ontdek Jávea met ons vakantieappartement. Weersinformatie, stranden, restaurants. 3 minuten van Arenal strand. Direct boeken vanaf €130/nacht.',
          keywords: 'jávea, javea, weer jávea, klimaat jávea, arenal strand, costa blanca, vakantieappartement, verhuur jávea, vakantie jávea, spanje, valencia, vakantie spanje, appartement spanje, costa blanca verhuur, spanje vakantiehuizen, vakantieverblijf spanje, zomervakantie spanje, voorjaarsvakantie spanje, herfstvakantie spanje, weekendje weg spanje, vakantie costa del sol, spanje reizen, spanje toerisme, vakantieappartement valencia, ferienwoning spanje, holidayhome spain, appartement costa blanca, villa spanje, vakantiehuis costa brava, chabada jávea, la bambula, restaurants jávea, weer jávea vandaag, montañar, granadella, sardinera',
          weatherKeywords: 'weer jávea vandaag, voorspelling jávea, klimaat costa blanca, temperatuur jávea, zon jávea, weer valencia, klimaat alicante, mediterraan klimaat spanje, weersvoorspelling costa blanca',
          beachKeywords: 'arenal strand jávea, beste stranden jávea, montañar strand, cala granadella, stranden costa blanca, blauwe vlag valencia, schone stranden spanje, mediterrane kust, cala sardinera',
          restaurantKeywords: 'restaurants jávea, chabada jávea, la bambula, waar eten jávea, valenciaanse keuken, restaurants costa blanca, zeevruchten jávea, paella valencia, masena jávea, bohemians jávea',
          tourismKeywords: 'toerisme jávea, wat doen jávea, wat zien jávea, activiteiten jávea, excursies jávea, kaap la nao, montgó, natuurpark, wandelen jávea, duiken jávea, watersporten',
          geoTargeting: 'nederland amsterdam rotterdam den haag utrecht eindhoven tilburg groningen almere breda nijmegen enschede haarlem arnhem zaanstad apeldoorn amersfoort zwolle ede delft leeuwarden alkmaar maastricht dordrecht leiden zoetermeer belgie antwerpen gent charleroi luik brugge namen leuven mons kortrijk hasselt oostende suriname paramaribo nickerie nieuw-amsterdam albina moengo totness lelydorp nieuw-nickerie antillen curacao aruba sint-maarten bonaire sint-eustatius saba willemstad oranjestad philipsburg kralendijk the-bottom saba vlaanderen antwerpen gent brugge leuven hasselt mechelen aalst sint-niklaas roeselare kortrijk oostende genk turnhout mol lommel tongeren diest oudenaarde dendermonde sint-truiden'
        };
      case 'de':
        return {
          title: 'Jávea Ferienwohnung - Wetter, Arenal Strand, Costa Blanca Spanien',
          description: 'Entdecken Sie Jávea mit unserer Ferienwohnung. Wetterinformationen, Strände, Restaurants. 3 Minuten vom Arenal Strand. Direkt buchen ab €130/Nacht.',
          keywords: 'jávea, javea, wetter jávea, klima jávea, arenal strand, costa blanca, ferienwohnung, vermietung jávea, urlaub jávea, spanien, valencia, urlaub spanien, ferienhaus spanien, costa blanca ferienwohnung, spanien ferien, sommerurlaub spanien, osterurlaub spanien, pfingsturlaub spanien, herbstferien spanien, winterurlaub spanien, kurzurlaub spanien, wochenende spanien, spanienreise, costa del sol urlaub, valencia urlaub, alicante urlaub, ferienappartement spanien, villa spanien, ferienhaus costa blanca, appartement valencia, urlaubsunterkunft spanien, chabada jávea, la bambula, restaurants jávea, wetter jávea heute, montañar, granadella, sardinera',
          weatherKeywords: 'wetter jávea heute, vorhersage jávea, klima costa blanca, temperatur jávea, sonne jávea, wetter valencia, klima alicante, mediterranes klima spanien, wetterprognose costa blanca',
          beachKeywords: 'arenal strand jávea, beste strände jávea, montañar strand, cala granadella, strände costa blanca, blaue flagge valencia, saubere strände spanien, mittelmeerküste, cala sardinera',
          restaurantKeywords: 'restaurants jávea, chabada jávea, la bambula, wo essen jávea, valencianische küche, restaurants costa blanca, meeresfrüchte jávea, paella valencia, masena jávea, bohemians jávea',
          tourismKeywords: 'tourismus jávea, was tun jávea, was sehen jávea, aktivitäten jávea, ausflüge jávea, kap la nao, montgó, naturpark, wandern jávea, tauchen jávea, wassersport',
          geoTargeting: 'deutschland berlin hamburg münchen köln frankfurt stuttgart düsseldorf dortmund essen leipzig bremen dresden hannover nürnberg duisburg bochum wuppertal bielefeld bonn mannheim karlsruhe augsburg wiesbaden mönchengladbach gelsenkirchen braunschweig chemnitz kiel aachen halle magdeburg freiburg krefeld lübeck oberhausen erfurt mainz rostock kassel hagen hamm saarbrücken mülheim ludwigshafen leverkusen oldenburg osnabrück solingen heidelberg herne neuss darmstadt paderborn regensburg ingolstadt würzburg fürth wolfsburg offenbach ulm heilbronn pforzheim göttingen bottrop trier recklinghausen reutlingen bremerhaven koblenz bergisch gladbach jena remscheid erlangen moers siegen hildesheim salzgitter österreich wien graz linz salzburg innsbruck klagenfurt villach wels sankt-pölten dornbirn steyr wiener-neustadt feldkirch bregenz leonding schweiz zürich genf basel bern lausanne winterthur luzern st-gallen lugano biel thun köniz la-chaux-de-fonds schaffhausen fribourg vernier chur neuchâtel uster sion emmen yverdon-les-bains zug kriens rapperswil-jona dietikon frauenfeld wettingen südtirol bozen meran brixen bruneck sterzing schlanders lana eppan kaltern neumarkt völs ritten kastelruth wolkenstein'
        };
      case 'es':
        return {
          title: 'Alquiler Vacacional Jávea - Escapada desde Madrid, Barcelona y Valencia | Costa Blanca',
          description: 'Apartamento de lujo en Jávea, a 3 minutos de Playa Arenal. Escapada perfecta desde Madrid (4h), Barcelona (3,5h) o Valencia (1,5h). Reserva directa desde €130/noche. Semana Santa, puentes y verano.',
          keywords: 'alquiler vacacional jávea, escapada desde madrid a la costa, fin de semana desde barcelona costa blanca, apartamento cerca de valencia playa, jávea a 1 hora de valencia, jávea desde madrid puente, jávea desde barcelona semana santa, costa blanca desde madrid, playa cerca de madrid, escapada de playa desde madrid, fin de semana playa desde barcelona, alquiler costa blanca semana santa, puente mayo costa blanca, vacaciones verano jávea, apartamento jávea reserva directa, alquiler jávea precio, costa blanca apartamento, playa arenal jávea, javea, tiempo jávea, clima jávea, vacaciones mediterráneo, turismo jávea, escapada españa, puentes españa, vacaciones otoño españa, semana santa playa españa, chabada jávea, la bambula, restaurantes jávea, montañar, granadella, sardinera, alicante, dénia, xàbia',
          weatherKeywords: 'tiempo jávea hoy, previsión jávea, clima costa blanca, temperatura jávea, sol jávea, tiempo valencia, clima alicante, clima mediterráneo españa, pronóstico costa blanca, cuánto sol hace en jávea, temperatura media jávea por meses',
          beachKeywords: 'playa arenal jávea, mejores playas jávea, playa montañar, cala granadella, playas costa blanca desde madrid, playas cerca de valencia, bandera azul valencia, playas limpias españa, costa mediterránea, cala sardinera, playas tranquilas alicante',
          restaurantKeywords: 'restaurantes jávea, chabada jávea, la bambula, dónde comer jávea, gastronomía valenciana, restaurantes costa blanca, mariscos jávea, paella valencia, masena jávea, bohemians jávea, arroces alicante',
          tourismKeywords: 'turismo jávea, qué hacer en jávea, qué ver en jávea, actividades jávea, excursiones jávea, cabo la nao, montgó, parque natural montgó, senderismo jávea, buceo jávea, deportes acuáticos jávea, jávea con niños, jávea en familia, visitar jávea desde valencia, visitar jávea desde madrid, visitar jávea desde barcelona',
          geoTargeting: 'madrid barcelona valencia sevilla zaragoza málaga murcia palma bilbao alicante córdoba valladolid vigo gijón hospitalet coruña vitoria granada elche oviedo badalona cartagena terrassa jerez sabadell móstoles alcalá fuenlabrada almería santander leganés san sebastián burgos castellón albacete alcorcón getafe salamanca logroño huelva badajoz tarragona lleida marbella león cádiz jaén girona reus dénia gandia benidorm calp altea benissa teulada moraira pedreguer gata-de-gorgos ondara pego oliva cullera gandia xàtiva ontinyent alzira torrent mislata paterna burjassot sagunto quart-de-poblet manises badalona sabadell terrassa hospitalet cornellà sant-boi el-prat viladecans gavà castelldefels sitges vilanova-i-la-geltrú'
        };
      default: // English
        return {
          title: 'Jávea Vacation Rental - Weather, Arenal Beach, Costa Blanca Spain',
          description: 'Discover Jávea with our vacation apartment. Weather info, beaches, restaurants. 3 minutes from Arenal Beach. Direct booking from €130/night.',
          keywords: 'jávea, javea, jávea weather, jávea climate, arenal beach, costa blanca, vacation rental, jávea rental, jávea holidays, spain, valencia, spain vacation, vacation spain, holiday spain, costa blanca rental, spain apartment, valencia vacation, alicante holiday, spanish villa, holiday rental spain, summer vacation spain, easter holidays spain, spring break spain, winter holidays spain, weekend getaway spain, spain travel, costa del sol vacation, mediterranean vacation, spain tourism, holiday apartment valencia, airbnb spain alternative, vacation home spain, holiday let costa blanca, chabada jávea, la bambula, restaurants jávea, jávea weather today, montañar, granadella, sardinera',
          weatherKeywords: 'jávea weather today, jávea forecast, costa blanca climate, jávea temperature, jávea sunshine, valencia weather, alicante climate, mediterranean weather spain, costa blanca forecast',
          beachKeywords: 'arenal beach jávea, best beaches jávea, montañar beach, cala granadella, costa blanca beaches, blue flag valencia, clean beaches spain, mediterranean coast, cala sardinera',
          restaurantKeywords: 'restaurants jávea, chabada jávea, la bambula, where to eat jávea, valencian cuisine, costa blanca restaurants, seafood jávea, paella valencia, masena jávea, bohemians jávea',
          tourismKeywords: 'tourism jávea, what to do jávea, what to see jávea, activities jávea, excursions jávea, cape la nao, montgó, natural park, hiking jávea, diving jávea, water sports',
          geoTargeting: 'uk united kingdom london birmingham manchester glasgow liverpool leeds sheffield bristol edinburgh cardiff belfast coventry leicester nottingham newcastle hull plymouth stoke preston wolverhampton derby swansea southampton reading oxford wakefield northampton luton york stockport blackpool poole oldham exeter ipswich middlesbrough swindon huddersfield bournemouth telford peterborough brighton doncaster darlington hastings watford st-albans blackburn barry ayr paisley east-kilbride livingston hamilton cumbernauld kirkcaldy dunfermline ayr irvine kilmarnock greenock dumfries ireland dublin cork limerick galway waterford drogheda dundalk bray navan kilkenny sligo carlow usa new-york los-angeles chicago houston phoenix philadelphia san-antonio san-diego dallas san-jose austin jacksonville fort-worth columbus charlotte san-francisco indianapolis seattle denver washington boston el-paso detroit nashville memphis portland oklahoma-city las-vegas baltimore louisville milwaukee albuquerque tucson fresno sacramento kansas-city mesa atlanta colorado-springs virginia-beach raleigh omaha miami oakland minneapolis tulsa cleveland wichita arlington canada toronto montreal vancouver calgary ottawa edmonton quebec-city winnipeg hamilton kitchener london victoria halifax oshawa windsor saskatoon regina sherbrooke st-johns barrie kelowna abbotsford kingston trois-rivières guelph cambridge whitby coquitlam saanich terrebonne milton st-catharines australia sydney melbourne brisbane perth adelaide gold-coast newcastle canberra sunshine-coast wollongong hobart geelong townsville cairns darwin toowoomba ballarat bendigo albury-wodonga launceston mackay rockhampton bunbury bundaberg coffs-harbour wagga-wagga hervey-bay mildura shepparton port-macquarie gladstone tamworth traralgon orange dubbo new-zealand auckland wellington christchurch hamilton tauranga napier-hastings dunedin palmerston-north nelson rotorua new-plymouth whangarei invercargill whanganui gisborne south-africa johannesburg cape-town durban pretoria port-elizabeth bloemfontein east-london vereeniging welkom pietermaritzburg richards-bay witbank vanderbijlpark centurion roodepoort boksburg benoni springs carletonville klerksdorp potchefstroom rustenburg polokwane nelspruit kimberley'
        };
    }
  };

  const getHiddenContent = () => {
    switch (language) {
      case 'it':
        return 'Scopri Jávea - appartamento vacanze Costa Blanca vicino spiaggia Arenal. Clima mediterraneo, gastronomia locale, attività acquatiche.';
      case 'fr':
        return 'Découvrez Jávea - appartement vacances Costa Blanca près plage Arenal. Climat méditerranéen, gastronomie locale, activités nautiques.';
      case 'nl':
        return 'Ontdek Jávea - vakantieappartement Costa Blanca nabij strand Arenal. Mediterraans klimaat, lokale gastronomie, watersportactiviteiten.';
      case 'de':
        return 'Entdecken Sie Jávea - Ferienwohnung Costa Blanca nahe Strand Arenal. Mediterranes Klima, lokale Gastronomie, Wassersportaktivitäten.';
      case 'es':
        return 'Descubre Jávea (Xàbia) - apartamento vacacional de lujo en Costa Blanca, a 3 minutos de Playa Arenal. Escapada perfecta desde Madrid (4 horas), Barcelona (3,5 horas) o Valencia (solo 1,5 horas en coche). Alquiler vacacional con reserva directa desde €130/noche. Ideal para Semana Santa, puente de mayo, verano y fines de semana largos. Playas de bandera azul, gastronomía valenciana, actividades acuáticas, senderismo por el Montgó. Visita Cala Granadella, Playa Montañar y Cabo de la Nao. Restaurantes locales: Chabada, La Bambula, Masena. WiFi 600Mbps perfecto para teletrabajo.';
      default:
        return 'Discover Jávea - vacation apartment Costa Blanca near Arenal Beach. Mediterranean climate, local gastronomy, water activities.';
    }
  };

  const seo = getSEOContent();

  return (
    <>
      {/* Clean SEO content section */}
      <section className="sr-only" aria-hidden="true">
        <h2>Explore Jávea</h2>
        <p>Discover the best local gastronomy, beaches, and hidden gems just minutes from your door.</p>
        <p>{getHiddenContent()}</p>
      </section>
    </>
  );
};

export default OptimizedSEOStrategy;
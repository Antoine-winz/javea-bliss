import { useLanguage } from '@/contexts/LanguageContext';

const TrendingSection = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: "Staying Longer in Javea",
      subtitle: "From 35 nights, the rate drops to €100 a night. Three reasons guests stay for weeks rather than days.",
      winterSun: "Winter Sun",
      winterSunDesc: "Sheltered by the Montgó, Javea sees over 300 days of sun a year and winter days of 14–18°C. Heating, a lift and restaurants that stay open all year make it an easy place to sit out a northern winter.",
      remoteWork: "Working by the Sea",
      remoteWorkDesc: "600 Mbps fibre, a quiet canal-side terrace to work from, and the beach 250 m away for the lunch break. Low-season rates make a month here cheaper than you would expect.",
      renovation: "Between Homes",
      renovationDesc: "Renovating a villa nearby, or waiting on a move? A furnished flat with its own parking, a full kitchen and space on the patio for bikes and tools beats a hotel for weeks on end.",
    },
    nl: {
      title: "Langer Blijven in Jávea",
      subtitle: "Vanaf 35 nachten daalt het tarief naar €100 per nacht. Drie redenen waarom gasten weken blijven in plaats van dagen.",
      winterSun: "Overwinteren in de Zon",
      winterSunDesc: "Beschut door de Montgó telt Jávea ruim 300 zonuren-dagen per jaar en winterdagen van 14–18°C. Met verwarming, een lift en restaurants die het hele jaar open zijn, kom je de Nederlandse winter hier makkelijk door.",
      remoteWork: "Werken aan Zee",
      remoteWorkDesc: "600 Mbps glasvezel, een rustig terras aan het kanaal om vanuit te werken, en het strand op 250 meter voor de lunchpauze. In het laagseizoen is een maand hier goedkoper dan je denkt.",
      renovation: "Tussen Twee Huizen",
      renovationDesc: "Verbouw je een villa in de buurt, of wacht je op een verhuizing? Een gemeubileerd appartement met eigen parkeerplek, een complete keuken en ruimte op de patio voor fietsen en gereedschap is prettiger dan weken in een hotel.",
    },
    fr: {
      title: "Séjours Longue Durée à Jávea",
      subtitle: "À partir de 35 nuits, le tarif descend à 100 € la nuit. Trois raisons pour lesquelles nos hôtes restent des semaines plutôt que des jours.",
      winterSun: "Hivernage au Soleil",
      winterSunDesc: "Abritée par le Montgó, Jávea compte plus de 300 jours de soleil par an et des journées d'hiver de 14 à 18 °C. Chauffage, ascenseur et restaurants ouverts toute l'année : passer l'hiver ici est simple.",
      remoteWork: "Télétravail au Bord de l'Eau",
      remoteWorkDesc: "Fibre 600 Mbps, une terrasse tranquille sur le canal pour travailler, et la plage à 250 m pour la pause déjeuner. Hors saison, un mois ici coûte moins cher qu'on ne l'imagine.",
      renovation: "Entre Deux Logements",
      renovationDesc: "Vous rénovez une villa dans la région, ou attendez un déménagement ? Un appartement meublé avec parking privé, cuisine complète et de la place sur le patio pour vélos et outils vaut mieux que des semaines à l'hôtel.",
    },
    de: {
      title: "Länger Bleiben in Jávea",
      subtitle: "Ab 35 Nächten sinkt der Preis auf 100 € pro Nacht. Drei Gründe, warum Gäste hier Wochen statt Tage bleiben.",
      winterSun: "Überwintern in der Sonne",
      winterSunDesc: "Vom Montgó geschützt, zählt Jávea über 300 Sonnentage im Jahr und Wintertage von 14–18 °C. Heizung, Aufzug und ganzjährig geöffnete Restaurants machen das Überwintern hier unkompliziert.",
      remoteWork: "Arbeiten am Meer",
      remoteWorkDesc: "600 Mbit/s Glasfaser, eine ruhige Terrasse am Kanal zum Arbeiten und der Strand 250 m entfernt für die Mittagspause. In der Nebensaison kostet ein Monat hier weniger als gedacht.",
      renovation: "Zwischen Zwei Wohnungen",
      renovationDesc: "Sie renovieren eine Villa in der Nähe oder warten auf einen Umzug? Eine möblierte Wohnung mit eigenem Stellplatz, kompletter Küche und Platz auf dem Patio für Räder und Werkzeug ist angenehmer als wochenlang Hotel.",
    },
    es: {
      title: "Estancias Largas en Jávea",
      subtitle: "A partir de 35 noches, la tarifa baja a 100 € por noche. Tres razones por las que la gente se queda semanas y no días.",
      winterSun: "Invierno al Sol",
      winterSunDesc: "Resguardada por el Montgó, Jávea supera los 300 días de sol al año, con jornadas de invierno de 14 a 18 °C. Calefacción, ascensor y restaurantes abiertos todo el año: pasar aquí el invierno es fácil.",
      remoteWork: "Teletrabajar Junto al Mar",
      remoteWorkDesc: "Fibra de 600 Mb, una terraza tranquila sobre el canal para trabajar y la playa a 250 m para la pausa de la comida. Fuera de temporada, un mes aquí cuesta menos de lo que imaginas.",
      renovation: "Entre Dos Casas",
      renovationDesc: "¿Reformas una villa en la zona o esperas una mudanza? Un piso amueblado con parking propio, cocina completa y sitio en el patio para bicis y herramientas gana a semanas de hotel.",
    },
    it: {
      title: "Soggiorni Lunghi a Jávea",
      subtitle: "Da 35 notti in su la tariffa scende a 100 € a notte. Tre motivi per cui gli ospiti restano settimane invece che giorni.",
      winterSun: "Inverno al Sole",
      winterSunDesc: "Riparata dal Montgó, Jávea conta oltre 300 giorni di sole all'anno e giornate invernali di 14–18 °C. Riscaldamento, ascensore e ristoranti aperti tutto l'anno rendono facile passare qui l'inverno.",
      remoteWork: "Lavorare sul Mare",
      remoteWorkDesc: "Fibra da 600 Mbps, una terrazza tranquilla sul canale da cui lavorare e la spiaggia a 250 m per la pausa pranzo. In bassa stagione un mese qui costa meno di quanto pensi.",
      renovation: "Tra Due Case",
      renovationDesc: "Stai ristrutturando una villa in zona o aspetti un trasloco? Un appartamento arredato con posto auto, cucina completa e spazio nel patio per bici e attrezzi è meglio di settimane in albergo.",
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <section className="py-12 bg-emerald-50" data-testid="section-long-stays">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">{t.title}</h2>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md" data-testid="card-winter-sun">
            <div className="text-4xl mb-4">☀️</div>
            <h3 className="text-xl font-bold mb-2">{t.winterSun}</h3>
            <p className="text-gray-600">{t.winterSunDesc}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md" data-testid="card-remote-work">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="text-xl font-bold mb-2">{t.remoteWork}</h3>
            <p className="text-gray-600">{t.remoteWorkDesc}</p>
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

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

const faqs = {
  en: [
    {
      q: 'How far is Jávea Bliss from Arenal Beach?',
      a: 'Jávea Bliss is just 250 metres (about a 3-minute walk) from Arenal Beach. You can walk directly to the sand, La Bambula and Chabada restaurant without a car or taxi.',
    },
    {
      q: 'How many guests can stay at Jávea Bliss?',
      a: 'The apartment sleeps up to 4 guests comfortably in 2 bedrooms. It is ideal for couples, families with children, or small groups of friends.',
    },
    {
      q: 'Is parking included?',
      a: 'Yes. Free private parking is included with every booking. No need to hunt for street parking — your space is reserved for you.',
    },
    {
      q: 'Is the apartment suitable for families?',
      a: 'Absolutely. The 2-bedroom layout, full kitchen, lift, balcony, and proximity to Arenal Beach make it an excellent choice for families travelling with children.',
    },
    {
      q: 'Can I stay in Jávea without a car?',
      a: 'Yes. Arenal Beach, local supermarkets, pharmacies, and the best restaurants are all within walking distance of the apartment. A car is useful for exploring the wider area but not essential for a beach holiday.',
    },
    {
      q: 'Is Jávea Bliss suitable for winter stays?',
      a: 'Yes — Jávea enjoys a mild Mediterranean climate with over 300 sunny days a year, making it a popular choice for winter stays and overwintering. The apartment is fully equipped with heating, high-speed Wi-Fi, and a complete kitchen for longer stays.',
    },
  ],
  nl: [
    {
      q: 'Hoe ver is Jávea Bliss van Arenal Beach?',
      a: 'Jávea Bliss ligt op slechts 250 meter (circa 3 minuten lopen) van Arenal Beach. Je loopt rechtstreeks naar het strand, La Bambula en Chabada zonder auto of taxi.',
    },
    {
      q: 'Hoeveel gasten kunnen verblijven bij Jávea Bliss?',
      a: 'Het appartement biedt slaapplaats voor maximaal 4 gasten in 2 slaapkamers. Ideaal voor koppels, gezinnen met kinderen of kleine vriendengroepen.',
    },
    {
      q: 'Is parkeren inbegrepen?',
      a: 'Ja. Gratis privéparkeren is bij elke boeking inbegrepen. Je parkeerplaats is voor jou gereserveerd.',
    },
    {
      q: 'Is het appartement geschikt voor gezinnen?',
      a: 'Zeker. De 2-slaapkamer indeling, complete keuken, lift, balkon en nabijheid van Arenal Beach maken het een uitstekende keuze voor gezinnen met kinderen.',
    },
    {
      q: 'Kan ik in Jávea verblijven zonder auto?',
      a: 'Ja. Arenal Beach, supermarkten, apotheken en de beste restaurants liggen allemaal op loopafstand. Een auto is handig voor uitstapjes, maar niet noodzakelijk voor een strandvakantie.',
    },
    {
      q: 'Is Jávea Bliss geschikt voor een winterverblijf?',
      a: 'Ja — Jávea heeft een mild mediterraan klimaat met meer dan 300 zonnedagen per jaar, ideaal voor overwinteren. Het appartement heeft verwarming, supersnel wifi en een complete keuken voor langere verblijven.',
    },
  ],
  fr: [
    {
      q: "À quelle distance Jávea Bliss se trouve-t-il de la plage Arenal ?",
      a: "Jávea Bliss est à seulement 250 mètres (environ 3 minutes à pied) de la plage Arenal. Vous pouvez vous y rendre à pied, ainsi qu'à La Bambula et Chabada, sans voiture ni taxi.",
    },
    {
      q: "Combien de personnes peuvent séjourner à Jávea Bliss ?",
      a: "L'appartement peut accueillir confortablement jusqu'à 4 personnes dans 2 chambres. Idéal pour les couples, les familles avec enfants ou les petits groupes d'amis.",
    },
    {
      q: "Le parking est-il inclus ?",
      a: "Oui. Un parking privé gratuit est inclus dans chaque réservation. Votre place est réservée.",
    },
    {
      q: "L'appartement convient-il aux familles ?",
      a: "Tout à fait. Les 2 chambres, la cuisine équipée, l'ascenseur, le balcon et la proximité de la plage Arenal en font un excellent choix pour les familles avec enfants.",
    },
    {
      q: "Peut-on séjourner à Jávea sans voiture ?",
      a: "Oui. La plage Arenal, les supermarchés, les pharmacies et les meilleurs restaurants sont tous accessibles à pied. Une voiture est utile pour explorer la région, mais pas indispensable pour des vacances à la plage.",
    },
    {
      q: "Jávea Bliss convient-il pour un séjour hivernal ?",
      a: "Oui — Jávea bénéficie d'un climat méditerranéen doux avec plus de 300 jours de soleil par an, ce qui en fait une destination prisée pour les séjours d'hiver. L'appartement est équipé du chauffage, du Wi-Fi haut débit et d'une cuisine complète.",
    },
  ],
  de: [
    {
      q: 'Wie weit ist Jávea Bliss vom Arenal Strand entfernt?',
      a: 'Jávea Bliss liegt nur 250 Meter (ca. 3 Minuten zu Fuß) vom Arenal Strand entfernt. Sie erreichen den Strand, La Bambula und Chabada bequem zu Fuß.',
    },
    {
      q: 'Wie viele Gäste können in Jávea Bliss übernachten?',
      a: 'Die Wohnung bietet komfortablen Platz für bis zu 4 Gäste in 2 Schlafzimmern. Ideal für Paare, Familien mit Kindern oder kleine Freundesgruppen.',
    },
    {
      q: 'Ist Parken inklusive?',
      a: 'Ja. Ein kostenloser Privatparkplatz ist in jeder Buchung enthalten. Ihr Stellplatz ist für Sie reserviert.',
    },
    {
      q: 'Ist die Wohnung für Familien geeignet?',
      a: 'Absolut. Das 2-Zimmer-Layout, die vollausgestattete Küche, der Aufzug, der Balkon und die Nähe zum Arenal Strand machen die Wohnung zur idealen Wahl für Familien mit Kindern.',
    },
    {
      q: 'Kann ich Jávea ohne Auto genießen?',
      a: 'Ja. Arenal Strand, Supermärkte, Apotheken und die besten Restaurants sind alle fußläufig erreichbar. Ein Auto ist für Ausflüge nützlich, aber für einen Strandurlaub nicht erforderlich.',
    },
    {
      q: 'Ist Jávea Bliss für Winteraufenthalte geeignet?',
      a: 'Ja — Jávea hat ein mildes Mittelmeerklima mit über 300 Sonnentagen pro Jahr und ist ein beliebtes Ziel zum Überwintern. Die Wohnung verfügt über Heizung, Highspeed-WLAN und eine vollausgestattete Küche.',
    },
  ],
  es: [
    {
      q: '¿A qué distancia está Jávea Bliss de la Playa Arenal?',
      a: 'Jávea Bliss está a solo 250 metros (unos 3 minutos a pie) de la Playa Arenal. Puedes llegar andando a la playa, La Bambula y Chabada sin necesidad de coche ni taxi.',
    },
    {
      q: '¿Cuántas personas pueden alojarse en Jávea Bliss?',
      a: 'El apartamento tiene capacidad para hasta 4 personas en 2 habitaciones. Ideal para parejas, familias con niños o grupos pequeños de amigos.',
    },
    {
      q: '¿Está incluido el aparcamiento?',
      a: 'Sí. El aparcamiento privado gratuito está incluido en cada reserva. Tu plaza está reservada para ti.',
    },
    {
      q: '¿Es el apartamento adecuado para familias?',
      a: 'Por supuesto. Las 2 habitaciones, la cocina completa, el ascensor, el balcón y la proximidad a la Playa Arenal lo convierten en una opción excelente para familias con niños.',
    },
    {
      q: '¿Se puede disfrutar de Jávea sin coche?',
      a: 'Sí. La Playa Arenal, supermercados, farmacias y los mejores restaurantes están a poca distancia a pie. Un coche es útil para excursiones, pero no es imprescindible para unas vacaciones de playa.',
    },
    {
      q: '¿Es Jávea Bliss adecuado para estancias de invierno?',
      a: 'Sí — Jávea disfruta de un clima mediterráneo suave con más de 300 días de sol al año, muy popular para estancias de invierno. El apartamento tiene calefacción, Wi-Fi de alta velocidad y cocina completa para estancias largas.',
    },
  ],
  it: [
    {
      q: "A che distanza si trova Jávea Bliss dalla spiaggia Arenal?",
      a: "Jávea Bliss si trova a soli 250 metri (circa 3 minuti a piedi) dalla spiaggia Arenal. Puoi raggiungere la spiaggia, La Bambula e Chabada a piedi, senza bisogno di auto o taxi.",
    },
    {
      q: "Quanti ospiti possono soggiornare a Jávea Bliss?",
      a: "L'appartamento ospita comodamente fino a 4 persone in 2 camere da letto. Ideale per coppie, famiglie con bambini o piccoli gruppi di amici.",
    },
    {
      q: "Il parcheggio è incluso?",
      a: "Sì. Il parcheggio privato gratuito è incluso in ogni prenotazione. Il tuo posto è riservato.",
    },
    {
      q: "L'appartamento è adatto alle famiglie?",
      a: "Assolutamente. Le 2 camere da letto, la cucina completa, l'ascensore, il balcone e la vicinanza alla spiaggia Arenal lo rendono una scelta eccellente per le famiglie con bambini.",
    },
    {
      q: "Si può soggiornare a Jávea senza auto?",
      a: "Sì. La spiaggia Arenal, i supermercati, le farmacie e i migliori ristoranti sono tutti raggiungibili a piedi. Un'auto è utile per le gite, ma non è indispensabile per una vacanza al mare.",
    },
    {
      q: "Jávea Bliss è adatto per soggiorni invernali?",
      a: "Sì — Jávea gode di un clima mediterraneo mite con oltre 300 giorni di sole all'anno, molto popolare per i soggiorni invernali. L'appartamento è dotato di riscaldamento, Wi-Fi ad alta velocità e una cucina completa.",
    },
  ],
};

const titles: Record<string, string> = {
  en: 'Frequently Asked Questions',
  nl: 'Veelgestelde Vragen',
  fr: 'Questions Fréquentes',
  de: 'Häufig gestellte Fragen',
  es: 'Preguntas Frecuentes',
  it: 'Domande Frequenti',
};

const FAQSection = () => {
  const { language } = useLanguage();
  const items = faqs[language as keyof typeof faqs] || faqs.en;
  const title = titles[language] || titles.en;

  useEffect(() => {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    let script = document.querySelector('script[data-schema="faq"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', 'faq');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(faqSchema);
  }, [language, items]);

  return (
    <section className="py-16 bg-gray-50" id="faq" data-testid="section-faq">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-navy-900">{title}</h2>

        <div itemScope itemType="https://schema.org/FAQPage" className="max-w-3xl mx-auto space-y-6">
          {items.map((item, i) => (
            <div
              key={i}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h3 itemProp="name" className="font-semibold text-lg text-gray-900 mb-3">
                {item.q}
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-gray-600 leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

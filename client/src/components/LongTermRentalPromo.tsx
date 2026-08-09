import { useLanguage } from '@/contexts/LanguageContext';

const LongTermRentalPromo = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      badge: 'Long-stay rate',
      title: 'Winter Lets & Long Stays — €100 a Night',
      subtitle:
        'Stay 35 nights or more and the rate drops to €100 a night for the whole stay, whatever the season. Popular with people overwintering on the Costa Blanca, working remotely, or living here while a house is being renovated.',
      whatsIncluded: 'What the €100 a night covers',
      furnished: 'Furnished, with linens and towels',
      utilities: 'Water and electricity included',
      wifi: '600 Mbps fibre Wi-Fi',
      cleaning: 'Weekly cleaning',
      kitchen: 'Full kitchen and washing machine',
      climate: 'Heating and air conditioning',
      access: 'Lift and free private parking',
      owner: 'Direct contact with the owner',
      perDay: '/night',
      forStays: 'from 35 nights',
      vs: 'instead of',
      regularRates: 'the usual seasonal rates',
      bookLongTerm: 'Ask About a Long Stay',
      minimumStay:
        '* Minimum 35 nights (5 weeks). The rate applies to the whole stay. Tell us your dates and we will send a quote.',
    },
    nl: {
      badge: 'Langverblijftarief',
      title: 'Overwinteren & Langere Verblijven — €100 per Nacht',
      subtitle:
        'Blijf je 35 nachten of langer, dan geldt €100 per nacht voor het hele verblijf, in welk seizoen dan ook. Populair bij overwinteraars aan de Costa Blanca, mensen die op afstand werken, en wie hier woont terwijl het huis verbouwd wordt.',
      whatsIncluded: 'Wat je krijgt voor €100 per nacht',
      furnished: 'Gemeubileerd, met beddengoed en handdoeken',
      utilities: 'Water en elektriciteit inbegrepen',
      wifi: '600 Mbps glasvezel-wifi',
      cleaning: 'Wekelijkse schoonmaak',
      kitchen: 'Complete keuken en wasmachine',
      climate: 'Verwarming en airconditioning',
      access: 'Lift en gratis eigen parkeerplek',
      owner: 'Direct contact met de eigenaar',
      perDay: '/nacht',
      forStays: 'vanaf 35 nachten',
      vs: 'in plaats van',
      regularRates: 'de normale seizoenstarieven',
      bookLongTerm: 'Vraag naar een Lang Verblijf',
      minimumStay:
        '* Minimaal 35 nachten (5 weken). Het tarief geldt voor het hele verblijf. Geef je data door en we sturen een voorstel.',
    },
    fr: {
      badge: 'Tarif longue durée',
      title: 'Hivernage & Séjours Longue Durée — 100 € la Nuit',
      subtitle:
        'À partir de 35 nuits, le tarif passe à 100 € la nuit pour tout le séjour, quelle que soit la saison. Apprécié de ceux qui hivernent sur la Costa Blanca, travaillent à distance, ou logent ici pendant des travaux.',
      whatsIncluded: 'Ce que comprennent les 100 € la nuit',
      furnished: 'Meublé, linge de lit et serviettes fournis',
      utilities: 'Eau et électricité incluses',
      wifi: 'Wifi fibre 600 Mbps',
      cleaning: 'Ménage hebdomadaire',
      kitchen: 'Cuisine complète et lave-linge',
      climate: 'Chauffage et climatisation',
      access: 'Ascenseur et parking privé gratuit',
      owner: 'Contact direct avec le propriétaire',
      perDay: '/nuit',
      forStays: 'à partir de 35 nuits',
      vs: 'au lieu de',
      regularRates: 'les tarifs saisonniers habituels',
      bookLongTerm: 'Demander un Séjour Longue Durée',
      minimumStay:
        '* Minimum 35 nuits (5 semaines). Le tarif s\'applique à tout le séjour. Indiquez vos dates et nous vous envoyons un devis.',
    },
    de: {
      badge: 'Langzeittarif',
      title: 'Überwintern & Langzeitmiete — 100 € pro Nacht',
      subtitle:
        'Ab 35 Nächten gilt für den gesamten Aufenthalt ein Preis von 100 € pro Nacht, in jeder Saison. Beliebt bei Überwinterern an der Costa Blanca, bei Gästen im Homeoffice und bei allen, die während einer Renovierung hier wohnen.',
      whatsIncluded: 'Darin sind die 100 € pro Nacht enthalten',
      furnished: 'Möbliert, mit Bettwäsche und Handtüchern',
      utilities: 'Wasser und Strom inklusive',
      wifi: '600 Mbit/s Glasfaser-WLAN',
      cleaning: 'Wöchentliche Reinigung',
      kitchen: 'Komplette Küche und Waschmaschine',
      climate: 'Heizung und Klimaanlage',
      access: 'Aufzug und kostenloser Privatparkplatz',
      owner: 'Direkter Kontakt zum Eigentümer',
      perDay: '/Nacht',
      forStays: 'ab 35 Nächten',
      vs: 'statt',
      regularRates: 'der üblichen Saisonpreise',
      bookLongTerm: 'Langzeitaufenthalt Anfragen',
      minimumStay:
        '* Mindestens 35 Nächte (5 Wochen). Der Preis gilt für den gesamten Aufenthalt. Nennen Sie uns Ihre Daten, wir senden Ihnen ein Angebot.',
    },
    es: {
      badge: 'Tarifa larga estancia',
      title: 'Larga Temporada e Invierno — 100 € la Noche',
      subtitle:
        'A partir de 35 noches, la tarifa baja a 100 € por noche durante toda la estancia, sea la temporada que sea. Habitual entre quienes pasan el invierno en la Costa Blanca, teletrabajan, o viven aquí mientras reforman su casa.',
      whatsIncluded: 'Qué incluyen los 100 € por noche',
      furnished: 'Amueblado, con sábanas y toallas',
      utilities: 'Agua y luz incluidas',
      wifi: 'Wifi de fibra de 600 Mb',
      cleaning: 'Limpieza semanal',
      kitchen: 'Cocina completa y lavadora',
      climate: 'Calefacción y aire acondicionado',
      access: 'Ascensor y parking privado gratis',
      owner: 'Trato directo con el propietario',
      perDay: '/noche',
      forStays: 'desde 35 noches',
      vs: 'en lugar de',
      regularRates: 'las tarifas normales por temporada',
      bookLongTerm: 'Consultar Larga Estancia',
      minimumStay:
        '* Mínimo 35 noches (5 semanas). La tarifa se aplica a toda la estancia. Dinos tus fechas y te enviamos un presupuesto.',
    },
    it: {
      badge: 'Tariffa soggiorni lunghi',
      title: 'Soggiorni Lunghi e Inverno — 100 € a Notte',
      subtitle:
        'Da 35 notti in su la tariffa scende a 100 € a notte per tutto il soggiorno, in qualsiasi stagione. Scelta da chi passa l\'inverno sulla Costa Blanca, da chi lavora da remoto e da chi abita qui mentre ristruttura casa.',
      whatsIncluded: 'Cosa comprendono i 100 € a notte',
      furnished: 'Arredato, con lenzuola e asciugamani',
      utilities: 'Acqua e luce incluse',
      wifi: 'WiFi in fibra da 600 Mbps',
      cleaning: 'Pulizia settimanale',
      kitchen: 'Cucina completa e lavatrice',
      climate: 'Riscaldamento e aria condizionata',
      access: 'Ascensore e parcheggio privato gratuito',
      owner: 'Contatto diretto con il proprietario',
      perDay: '/notte',
      forStays: 'da 35 notti',
      vs: 'invece di',
      regularRates: 'le normali tariffe stagionali',
      bookLongTerm: 'Chiedi per un Soggiorno Lungo',
      minimumStay:
        '* Minimo 35 notti (5 settimane). La tariffa vale per tutto il soggiorno. Dicci le tue date e ti mandiamo un preventivo.',
    },
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const included = [
    t.furnished,
    t.utilities,
    t.wifi,
    t.cleaning,
    t.kitchen,
    t.climate,
    t.access,
    t.owner,
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50" data-testid="section-long-term">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
            <div className="mb-6">
              <button
                onClick={() => window.open('/flyer2.html', 'flyerPopup', 'width=800,height=1000,scrollbars=yes,resizable=yes')}
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors"
              >
                {t.badge}
              </button>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h2>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-semibold text-lg text-gray-800 mb-4 text-center">
                {t.whatsIncluded}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">€100{t.perDay}</div>
                <div className="text-sm text-gray-500">{t.forStays}</div>
              </div>
              <div className="text-center text-gray-400">
                <div className="text-sm">{t.vs}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 line-through">€130–€210{t.perDay}</div>
                <div className="text-sm text-gray-500">{t.regularRates}</div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="#booking"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                {t.bookLongTerm}
              </a>
            </div>

            <p className="text-xs text-gray-500 mt-4 max-w-xl mx-auto">
              {t.minimumStay}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LongTermRentalPromo;

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
    <section className="section bg-ink text-bone" data-testid="section-long-term">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-12 gap-x-16">
          <div className="lg:col-span-6">
            <button
              onClick={() => window.open('/flyer2.html', 'flyerPopup', 'width=800,height=1000,scrollbars=yes,resizable=yes')}
              className="eyebrow text-brass mb-5 hover:text-bone transition-colors"
            >
              {t.badge}
            </button>

            <h2 className="display-lg text-bone mb-7">{t.title}</h2>

            <p className="text-bone/75 font-light leading-relaxed max-w-xl mb-10">
              {t.subtitle}
            </p>

            {/* Price comparison, set as figures rather than a coloured badge. */}
            <div className="flex flex-wrap items-end gap-x-10 gap-y-4 mb-10">
              <div>
                <div className="font-display text-5xl text-bone leading-none">
                  €100<span className="text-2xl text-bone/60">{t.perDay}</span>
                </div>
                <div className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-brass mt-3">
                  {t.forStays}
                </div>
              </div>
              <div className="pb-1">
                <div className="font-display text-2xl text-bone/35 line-through leading-none">
                  €130–€210{t.perDay}
                </div>
                <div className="font-sans text-[0.75rem] tracking-[0.1em] uppercase text-bone/40 mt-3">
                  {t.vs} {t.regularRates}
                </div>
              </div>
            </div>

            <a href="#booking" className="btn-on-dark">{t.bookLongTerm}</a>
          </div>

          <div className="lg:col-span-6 lg:pl-8">
            <h3 className="font-sans text-[0.6875rem] tracking-[0.2em] uppercase text-bone/50 mb-2">
              {t.whatsIncluded}
            </h3>
            <ul>
              {included.map((item) => (
                <li
                  key={item}
                  className="hairline-dark py-4 flex items-baseline gap-3 text-[0.9375rem] text-bone/80"
                >
                  <span aria-hidden="true" className="text-brass text-xs leading-none">+</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[0.8125rem] text-bone/45 mt-8 leading-relaxed">
              {t.minimumStay}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LongTermRentalPromo;

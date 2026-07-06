import { useLanguage } from '@/contexts/LanguageContext';

const LongTermRentalPromo = () => {
  const { language } = useLanguage();

  const translations = {
    en: {
      specialRate: "Special Long-Term Rate",
      title: "€100/Day for Extended Stays",
      subtitle: "Perfect for business travelers, executives, and temporary housing needs",
      executiveHousing: "Executive Housing",
      executiveDesc: "Fully furnished apartment perfect for work assignments and corporate relocations",
      houseRenovations: "House Renovations", 
      renovationsDesc: "Temporary luxury accommodation while your home is being renovated",
      extendedHolidays: "Extended Holidays",
      holidaysDesc: "Long-term vacation stays with significant savings for 5+ weeks",
      whatsIncluded: "What's Included at €100/Day",
      fullyFurnished: "Fully Furnished",
      allUtilities: "All Utilities",
      highSpeedWifi: "High-Speed WiFi",
      weeklyCleaning: "Weekly Cleaning",
      kitchenEquipped: "Kitchen Equipped",
      linensAndTowels: "Linens & Towels",
      primeLocation: "Prime Location",
      support247: "24/7 Support",
      perDay: "/day",
      forStays: "for stays 35+ nights",
      vs: "vs",
      regularRates: "regular rates",
      bookLongTerm: "Book Long-Term Stay",
      minimumStay: "* Minimum stay 35 nights (5 weeks). Rate applies to entire stay duration."
    },
    es: {
      specialRate: "Tarifa Especial a Largo Plazo",
      title: "€100/Día para Estancias Prolongadas",
      subtitle: "Perfecto para viajeros de negocios, ejecutivos y necesidades de alojamiento temporal",
      executiveHousing: "Alojamiento Ejecutivo",
      executiveDesc: "Apartamento completamente amueblado perfecto para asignaciones de trabajo y reubicaciones corporativas",
      houseRenovations: "Renovaciones de Casa",
      renovationsDesc: "Alojamiento de lujo temporal mientras su hogar está siendo renovado",
      extendedHolidays: "Vacaciones Prolongadas",
      holidaysDesc: "Estancias vacacionales a largo plazo con ahorros significativos por 5+ semanas",
      whatsIncluded: "Qué Está Incluido a €100/Día",
      fullyFurnished: "Completamente Amueblado",
      allUtilities: "Todos los Servicios",
      highSpeedWifi: "WiFi de Alta Velocidad",
      weeklyCleaning: "Limpieza Semanal",
      kitchenEquipped: "Cocina Equipada",
      linensAndTowels: "Sábanas y Toallas",
      primeLocation: "Ubicación Privilegiada",
      support247: "Soporte 24/7",
      perDay: "/día",
      forStays: "para estancias de 35+ noches",
      vs: "vs",
      regularRates: "tarifas regulares",
      bookLongTerm: "Reservar Estancia a Largo Plazo",
      minimumStay: "* Estancia mínima 35 noches (5 semanas). La tarifa se aplica a toda la duración de la estancia."
    },
    fr: {
      specialRate: "Tarif Spécial Long Terme",
      title: "€100/Jour pour Séjours Prolongés",
      subtitle: "Parfait pour les voyageurs d'affaires, cadres et besoins de logement temporaire",
      executiveHousing: "Logement Exécutif",
      executiveDesc: "Appartement entièrement meublé parfait pour les missions de travail et relocalisations d'entreprise",
      houseRenovations: "Rénovations de Maison",
      renovationsDesc: "Hébergement de luxe temporaire pendant que votre maison est en rénovation",
      extendedHolidays: "Vacances Prolongées",
      holidaysDesc: "Séjours de vacances à long terme avec économies significatives pour 5+ semaines",
      whatsIncluded: "Ce qui est Inclus à €100/Jour",
      fullyFurnished: "Entièrement Meublé",
      allUtilities: "Tous les Services",
      highSpeedWifi: "WiFi Haut Débit",
      weeklyCleaning: "Nettoyage Hebdomadaire",
      kitchenEquipped: "Cuisine Équipée",
      linensAndTowels: "Draps et Serviettes",
      primeLocation: "Emplacement de Choix",
      support247: "Support 24/7",
      perDay: "/jour",
      forStays: "pour séjours de 35+ nuits",
      vs: "vs",
      regularRates: "tarifs réguliers",
      bookLongTerm: "Réserver Séjour Long Terme",
      minimumStay: "* Séjour minimum 35 nuits (5 semaines). Le tarif s'applique à toute la durée du séjour."
    },
    nl: {
      specialRate: "Speciaal Langetermijn Tarief",
      title: "€100/Dag voor Verlengde Verblijven",
      subtitle: "Perfect voor zakenreizigers, executives en tijdelijke huisvestingsbehoeften",
      executiveHousing: "Executive Huisvesting",
      executiveDesc: "Volledig gemeubileerd appartement perfect voor werkopdrachten en bedrijfsverhuizingen",
      houseRenovations: "Huisrenovaties",
      renovationsDesc: "Tijdelijke luxe accommodatie terwijl uw huis wordt gerenoveerd",
      extendedHolidays: "Verlengde Vakanties",
      holidaysDesc: "Langetermijn vakantieverblijven met aanzienlijke besparingen voor 5+ weken",
      whatsIncluded: "Wat is Inbegrepen voor €100/Dag",
      fullyFurnished: "Volledig Gemeubileerd",
      allUtilities: "Alle Voorzieningen",
      highSpeedWifi: "Snelle WiFi",
      weeklyCleaning: "Wekelijkse Schoonmaak",
      kitchenEquipped: "Keuken Uitgerust",
      linensAndTowels: "Lakens & Handdoeken",
      primeLocation: "Toplocatie",
      support247: "24/7 Ondersteuning",
      perDay: "/dag",
      forStays: "voor verblijven van 35+ nachten",
      vs: "vs",
      regularRates: "reguliere tarieven",
      bookLongTerm: "Boek Langetermijn Verblijf",
      minimumStay: "* Minimum verblijf 35 nachten (5 weken). Tarief geldt voor hele verblijfsduur."
    },
    de: {
      specialRate: "Spezieller Langzeit-Tarif",
      title: "€100/Tag für Verlängerte Aufenthalte",
      subtitle: "Perfekt für Geschäftsreisende, Führungskräfte und temporäre Wohnbedürfnisse",
      executiveHousing: "Executive Unterbringung",
      executiveDesc: "Vollständig möblierte Wohnung perfekt für Arbeitsaufträge und Firmenumzüge",
      houseRenovations: "Hausrenovierungen",
      renovationsDesc: "Temporäre Luxusunterkunft während Ihr Zuhause renoviert wird",
      extendedHolidays: "Verlängerte Ferien",
      holidaysDesc: "Langzeit-Urlaubsaufenthalte mit erheblichen Einsparungen für 5+ Wochen",
      whatsIncluded: "Was ist bei €100/Tag enthalten",
      fullyFurnished: "Vollständig Möbliert",
      allUtilities: "Alle Nebenkosten",
      highSpeedWifi: "Hochgeschwindigkeits-WiFi",
      weeklyCleaning: "Wöchentliche Reinigung",
      kitchenEquipped: "Küchenausstattung",
      linensAndTowels: "Bettwäsche & Handtücher",
      primeLocation: "Erstklassige Lage",
      support247: "24/7 Support",
      perDay: "/Tag",
      forStays: "für Aufenthalte von 35+ Nächten",
      vs: "vs",
      regularRates: "reguläre Tarife",
      bookLongTerm: "Langzeit-Aufenthalt Buchen",
      minimumStay: "* Mindestaufenthalt 35 Nächte (5 Wochen). Tarif gilt für gesamte Aufenthaltsdauer."
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;
  
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
            <div className="mb-6">
              <button 
                onClick={() => window.open('/flyer2.html', 'flyerPopup', 'width=800,height=1000,scrollbars=yes,resizable=yes')}
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide cursor-pointer transition-colors"
              >
                {t.specialRate}
              </button>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t.title}
            </h2>
            
            <p className="text-xl text-gray-600 mb-6">
              {t.subtitle}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-green-800 mb-2">
                  {t.executiveHousing}
                </h3>
                <p className="text-green-700 text-sm">
                  {t.executiveDesc}
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-800 mb-2">
                  {t.houseRenovations}
                </h3>
                <p className="text-blue-700 text-sm">
                  {t.renovationsDesc}
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-purple-800 mb-2">
                  {t.extendedHolidays}
                </h3>
                <p className="text-purple-700 text-sm">
                  {t.holidaysDesc}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-3">
                {t.whatsIncluded}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>✓ {t.fullyFurnished}</div>
                <div>✓ {t.allUtilities}</div>
                <div>✓ {t.highSpeedWifi}</div>
                <div>✓ {t.weeklyCleaning}</div>
                <div>✓ {t.kitchenEquipped}</div>
                <div>✓ {t.linensAndTowels}</div>
                <div>✓ {t.primeLocation}</div>
                <div>✓ {t.support247}</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">€100{t.perDay}</div>
                <div className="text-sm text-gray-500">{t.forStays}</div>
              </div>
              <div className="text-center text-gray-400">
                <div className="text-lg">{t.vs}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400 line-through">€130-€210{t.perDay}</div>
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
            
            <p className="text-xs text-gray-500 mt-4">
              {t.minimumStay}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LongTermRentalPromo;
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const faqs = {
  en: [
    {
      q: 'How far is the apartment from Arenal Beach?',
      a: '250 metres — about a 3-minute walk. You can reach the sand, the promenade and the Arenal restaurants on foot without ever taking the car out.',
    },
    {
      q: 'How do I get to Jávea from the airport?',
      a: 'Alicante Airport (ALC) is the usual choice: around 100 km, or an hour and a quarter by car on the AP-7. Valencia Airport is a similar distance, roughly an hour and a half. Both are served by direct flights from most UK and northern European cities. Hire cars, airport taxis and shared shuttles all run to Jávea; tell us your arrival time and we will point you to the easiest option.',
    },
    {
      q: 'Do I need a car in Jávea?',
      a: 'Not for a beach holiday. The beach, supermarkets, a pharmacy and around twenty restaurants are all within a 10-minute walk. A car is useful for day trips — Cala Granadella, the Old Town, Dénia or Calpe — and if you bring one, your own free parking space is included, which is genuinely hard to find this close to the Arenal.',
    },
    {
      q: 'How many people can stay?',
      a: 'Four, in two bedrooms — one double and one twin. The living-room sofa converts to a single bed if you need a fifth berth. There is one bathroom, so it works best for a family or two couples.',
    },
    {
      q: 'Is it cheaper to book direct than through Airbnb or Booking.com?',
      a: 'Yes. Booking through this site means no platform service fee, which is typically 12–15% of the total on the big portals. You are dealing directly with the owner, so questions get answered by the person who actually knows the apartment.',
    },
    {
      q: 'The calendar shows my dates as unavailable — is that final?',
      a: 'Not always. The calendar syncs with Airbnb, and Airbnb sometimes blocks dates that are actually free. Send us your dates anyway — we can often take a direct booking on days the calendar shows as blocked.',
    },
    {
      q: 'Do you take long stays and winter lets?',
      a: 'Yes, and they are a large part of what we do. From 35 nights the rate is €100 a night for the whole stay, whatever the season. The apartment has heating as well as air conditioning, 600 Mbps fibre, a washing machine and a full kitchen, so it works for a month or three rather than just a week.',
    },
    {
      q: 'Is there a lift, and is the apartment suitable for older guests?',
      a: 'Yes — the building has a lift and the apartment is on the first floor, so there are no stairs to manage with luggage. Everything day-to-day is on the flat and within walking distance, which is why the apartment suits guests who would rather not drive.',
    },
    {
      q: 'How far ahead should I book?',
      a: 'For July and August, three to six months is sensible; the Arenal fills up. Easter and the Spanish long weekends go early too. Outside those periods there is usually more flexibility, and last-minute stays are often possible — just ask.',
    },
    {
      q: 'Are pets allowed?',
      a: 'No, we are not able to accept pets. Check-in is from 4:00 PM and check-out is by 12:00 noon; if your flight times make that awkward, ask us and we will do what we can.',
    },
  ],
  nl: [
    {
      q: 'Hoe ver is het appartement van het Arenal strand?',
      a: '250 meter — ongeveer 3 minuten lopen. Het strand, de boulevard en de restaurants van het Arenal bereik je te voet, zonder de auto te pakken.',
    },
    {
      q: 'Hoe kom ik vanaf het vliegveld in Jávea?',
      a: 'Alicante (ALC) is meestal de handigste: zo\'n 100 km, ruim een uur rijden over de AP-7. Valencia ligt op vergelijkbare afstand, ongeveer anderhalf uur. Op beide zijn er directe vluchten vanaf Amsterdam, Eindhoven, Rotterdam en Brussel/Charleroi. Huurauto, taxi of shuttle rijden allemaal naar Jávea; geef je aankomsttijd door, dan wijzen we je de makkelijkste optie.',
    },
    {
      q: 'Heb ik een auto nodig in Jávea?',
      a: 'Voor een strandvakantie niet. Het strand, supermarkten, een apotheek en een stuk of twintig restaurants liggen binnen 10 minuten lopen. Handig is een auto voor uitstapjes — Cala Granadella, de oude stad, Dénia of Calpe. Kom je met de auto, dan hoort er een eigen gratis parkeerplek bij; zo dicht bij het Arenal is dat echt zeldzaam.',
    },
    {
      q: 'Voor hoeveel personen is het appartement?',
      a: 'Vier, in twee slaapkamers — één met een tweepersoonsbed, één met twee eenpersoonsbedden. De bank in de woonkamer is uit te klappen tot eenpersoonsbed als je een vijfde slaapplaats nodig hebt. Er is één badkamer, dus het werkt het beste voor een gezin of twee stellen.',
    },
    {
      q: 'Is direct boeken goedkoper dan via Airbnb of Booking?',
      a: 'Ja. Boek je via deze site, dan betaal je geen servicekosten van het platform — op de grote portalen is dat al snel 12 tot 15% van het totaal. Je hebt direct contact met de eigenaar, dus je vragen worden beantwoord door iemand die het appartement echt kent.',
    },
    {
      q: 'De kalender zegt dat mijn data bezet zijn — is dat definitief?',
      a: 'Niet altijd. De kalender synchroniseert met Airbnb, en Airbnb blokkeert soms dagen die in werkelijkheid vrij zijn. Stuur je data gerust toch door — vaak kunnen we een directe boeking wél aannemen op dagen die geblokkeerd lijken.',
    },
    {
      q: 'Kan ik hier overwinteren of langere tijd verblijven?',
      a: 'Ja, en dat is een groot deel van wat we doen. Vanaf 35 nachten kost het €100 per nacht voor het hele verblijf, in welk seizoen dan ook. Er is verwarming én airco, 600 Mbps glasvezel, een wasmachine en een complete keuken — geschikt voor een maand of drie, niet alleen voor een weekje.',
    },
    {
      q: 'Is er een lift, en is het geschikt voor oudere gasten?',
      a: 'Ja — het gebouw heeft een lift en het appartement ligt op de eerste verdieping, dus je hoeft niet met koffers te sjouwen. Alles wat je dagelijks nodig hebt ligt vlak en op loopafstand, wat het prettig maakt voor gasten die liever niet rijden.',
    },
    {
      q: 'Hoe ver van tevoren moet ik boeken?',
      a: 'Voor juli en augustus is drie tot zes maanden verstandig; het Arenal zit dan vol. Ook Pasen en de Spaanse lange weekenden gaan snel. Daarbuiten is er meestal meer ruimte en kan het last minute vaak ook — vraag het gewoon even.',
    },
    {
      q: 'Zijn huisdieren toegestaan?',
      a: 'Nee, huisdieren kunnen we helaas niet ontvangen. Inchecken kan vanaf 16:00 uur en uitchecken is vóór 12:00 uur; komt dat slecht uit met je vlucht, laat het weten dan kijken we wat mogelijk is.',
    },
  ],
  fr: [
    {
      q: "À quelle distance se trouve la plage de l'Arenal ?",
      a: "250 mètres, soit environ 3 minutes à pied. Le sable, la promenade et les restaurants de l'Arenal sont accessibles à pied, sans jamais ressortir la voiture.",
    },
    {
      q: "Comment rejoindre Jávea depuis l'aéroport ?",
      a: "L'aéroport d'Alicante (ALC) est le plus pratique : environ 100 km, un peu plus d'une heure par l'AP-7. Valence est à distance comparable, environ une heure et demie. En voiture depuis la France, comptez près de 7 h depuis Toulouse et 8 h 30 depuis Lyon par l'A9 puis l'AP-7. Location de voiture, taxi et navettes desservent Jávea ; indiquez-nous votre heure d'arrivée et nous vous orienterons.",
    },
    {
      q: "Faut-il une voiture à Jávea ?",
      a: "Pas pour des vacances à la plage. La plage, les supermarchés, une pharmacie et une vingtaine de restaurants sont à moins de 10 minutes à pied. La voiture est utile pour les excursions — Cala Granadella, la vieille ville, Dénia ou Calpe — et si vous venez avec, une place de parking gratuite est incluse : une vraie rareté si près de l'Arenal.",
    },
    {
      q: "Combien de personnes peuvent loger ?",
      a: "Quatre, dans deux chambres — une avec lit double, une avec lits jumeaux. Le canapé du salon se transforme en lit simple pour un cinquième couchage. Il y a une salle de bain, ce qui convient bien à une famille ou à deux couples.",
    },
    {
      q: "Réserver en direct revient-il moins cher qu'Airbnb ou Booking ?",
      a: "Oui. En réservant sur ce site, vous ne payez pas les frais de service de la plateforme, qui représentent souvent 12 à 15 % du total sur les grands portails. Vous traitez directement avec le propriétaire, donc vos questions trouvent une réponse précise.",
    },
    {
      q: "Le calendrier indique mes dates comme indisponibles : est-ce définitif ?",
      a: "Pas toujours. Le calendrier se synchronise avec Airbnb, et Airbnb bloque parfois des dates en réalité libres. Envoyez-nous vos dates malgré tout : nous pouvons souvent accepter une réservation directe sur des jours affichés comme bloqués.",
    },
    {
      q: "Proposez-vous des séjours longue durée et des locations hivernales ?",
      a: "Oui, et c'est une grande partie de notre activité. À partir de 35 nuits, le tarif est de 100 € la nuit pour tout le séjour, quelle que soit la saison. L'appartement dispose du chauffage comme de la climatisation, de la fibre 600 Mbps, d'un lave-linge et d'une cuisine complète : de quoi rester un mois ou trois, pas seulement une semaine.",
    },
    {
      q: "Y a-t-il un ascenseur ? L'appartement convient-il aux personnes âgées ?",
      a: "Oui — l'immeuble a un ascenseur et l'appartement est au premier étage : pas d'escalier à monter avec les valises. Tout le quotidien est de plain-pied et accessible à pied, ce qui convient bien aux hôtes qui préfèrent ne pas conduire.",
    },
    {
      q: "Combien de temps à l'avance faut-il réserver ?",
      a: "Pour juillet et août, trois à six mois est raisonnable : l'Arenal se remplit. Pâques et les ponts espagnols partent vite également. Le reste de l'année, il y a généralement plus de souplesse, et le dernier moment reste souvent possible — demandez-nous.",
    },
    {
      q: "Les animaux sont-ils acceptés ?",
      a: "Non, nous ne pouvons pas accueillir d'animaux. L'arrivée se fait à partir de 16 h et le départ avant 12 h ; si vos horaires de vol compliquent les choses, dites-le-nous et nous ferons au mieux.",
    },
  ],
  de: [
    {
      q: 'Wie weit ist die Wohnung vom Arenal-Strand entfernt?',
      a: '250 Meter — etwa 3 Gehminuten. Strand, Promenade und die Restaurants am Arenal erreichen Sie zu Fuß, ohne das Auto zu bewegen.',
    },
    {
      q: 'Wie komme ich vom Flughafen nach Jávea?',
      a: 'Alicante (ALC) ist meist die beste Wahl: rund 100 km, gut eine Stunde über die AP-7. Valencia liegt ähnlich weit, etwa anderthalb Stunden. Direktflüge gibt es ab Frankfurt, München, Düsseldorf, Zürich und Wien in rund 2,5 Stunden. Mietwagen, Flughafentaxi und Shuttles fahren nach Jávea; nennen Sie uns Ihre Ankunftszeit, dann sagen wir Ihnen, was am einfachsten ist.',
    },
    {
      q: 'Braucht man in Jávea ein Auto?',
      a: 'Für einen Strandurlaub nicht. Strand, Supermärkte, Apotheke und rund zwanzig Restaurants liegen innerhalb von 10 Gehminuten. Für Ausflüge — Cala Granadella, Altstadt, Dénia oder Calpe — ist ein Auto praktisch, und wenn Sie eines mitbringen, gehört ein eigener kostenloser Stellplatz dazu. So nah am Arenal ist das eine Seltenheit.',
    },
    {
      q: 'Für wie viele Gäste ist die Wohnung?',
      a: 'Für vier, in zwei Schlafzimmern — eines mit Doppelbett, eines mit zwei Einzelbetten. Das Sofa im Wohnzimmer lässt sich zu einem Einzelbett ausziehen, falls ein fünfter Schlafplatz nötig ist. Es gibt ein Bad, daher eignet sich die Wohnung am besten für eine Familie oder zwei Paare.',
    },
    {
      q: 'Ist die Direktbuchung günstiger als über Airbnb oder Booking?',
      a: 'Ja. Über diese Seite zahlen Sie keine Servicegebühr der Plattform — auf den großen Portalen sind das schnell 12 bis 15 % der Gesamtsumme. Sie buchen direkt beim Eigentümer, Ihre Fragen beantwortet also jemand, der die Wohnung wirklich kennt.',
    },
    {
      q: 'Der Kalender zeigt meine Daten als belegt — ist das endgültig?',
      a: 'Nicht immer. Der Kalender synchronisiert sich mit Airbnb, und Airbnb sperrt gelegentlich Tage, die tatsächlich frei sind. Schicken Sie uns Ihre Daten trotzdem — häufig können wir für scheinbar blockierte Tage eine Direktbuchung annehmen.',
    },
    {
      q: 'Kann man bei Ihnen überwintern oder länger bleiben?',
      a: 'Ja, das ist ein großer Teil unseres Geschäfts. Ab 35 Nächten kostet die Wohnung 100 € pro Nacht für den gesamten Aufenthalt, in jeder Saison. Es gibt Heizung und Klimaanlage, 600 Mbit/s Glasfaser, eine Waschmaschine und eine komplette Küche — geeignet für einen Monat oder drei, nicht nur für eine Woche.',
    },
    {
      q: 'Gibt es einen Aufzug, und eignet sich die Wohnung für ältere Gäste?',
      a: 'Ja — das Haus hat einen Aufzug, und die Wohnung liegt im ersten Stock, Sie müssen also keine Koffer tragen. Alles Alltägliche ist eben und fußläufig erreichbar, was besonders Gästen entgegenkommt, die lieber nicht fahren möchten.',
    },
    {
      q: 'Wie früh sollte ich buchen?',
      a: 'Für Juli und August sind drei bis sechs Monate sinnvoll; der Arenal ist dann voll. Ostern und die spanischen langen Wochenenden sind ebenfalls schnell vergeben. Außerhalb dieser Zeiten ist meist mehr möglich, auch kurzfristig — fragen Sie einfach nach.',
    },
    {
      q: 'Sind Haustiere erlaubt?',
      a: 'Nein, Haustiere können wir leider nicht aufnehmen. Check-in ist ab 16:00 Uhr, Check-out bis 12:00 Uhr; wenn Ihre Flugzeiten das schwierig machen, sagen Sie Bescheid, wir finden meist eine Lösung.',
    },
  ],
  es: [
    {
      q: '¿A qué distancia está el apartamento de la Playa del Arenal?',
      a: 'A 250 metros, unos 3 minutos andando. La arena, el paseo y los restaurantes del Arenal se llegan a pie, sin sacar el coche.',
    },
    {
      q: '¿Cómo se llega a Jávea?',
      a: 'En coche: a 1 hora y media de Valencia por la AP-7, a 1 h 15 de Alicante, unas 4 horas desde Madrid por la A-3 y 4 h 30 desde Barcelona. Si vuelas, el aeropuerto de Alicante está a unos 100 km y el de Valencia a distancia parecida. Dinos tu hora de llegada y te decimos la mejor opción.',
    },
    {
      q: '¿Hace falta coche en Jávea?',
      a: 'Para unas vacaciones de playa, no. La playa, supermercados, farmacia y una veintena de restaurantes están a menos de 10 minutos andando. El coche va bien para excursiones — Cala Granadella, el casco antiguo, Dénia o Calpe — y si vienes con él, se incluye plaza de parking gratis: algo poco habitual tan cerca del Arenal, sobre todo en agosto.',
    },
    {
      q: '¿Para cuántas personas es el apartamento?',
      a: 'Para cuatro, en dos habitaciones: una con cama de matrimonio y otra con dos camas individuales. El sofá del salón se convierte en cama individual si necesitas una quinta plaza. Hay un baño, así que funciona mejor para una familia o dos parejas.',
    },
    {
      q: '¿Sale más barato reservar directo que por Airbnb o Booking?',
      a: 'Sí. Al reservar en esta web no pagas la comisión de servicio del portal, que en las grandes plataformas suele ser un 12–15% del total. Además tratas directamente con el propietario, así que quien responde a tus dudas conoce el apartamento de verdad.',
    },
    {
      q: 'El calendario marca mis fechas como ocupadas, ¿es definitivo?',
      a: 'No siempre. El calendario se sincroniza con Airbnb, y Airbnb a veces bloquea días que en realidad están libres. Mándanos tus fechas igualmente: muchas veces podemos aceptar una reserva directa en días que aparecen bloqueados.',
    },
    {
      q: '¿Hacéis estancias largas o de temporada?',
      a: 'Sí, y son una parte importante de lo que hacemos. A partir de 35 noches la tarifa es de 100 € por noche durante toda la estancia, sea la temporada que sea. Hay calefacción además de aire acondicionado, fibra de 600 Mb, lavadora y cocina completa: sirve para un mes o para tres, no solo para una semana.',
    },
    {
      q: '¿Hay ascensor? ¿Va bien para personas mayores?',
      a: 'Sí — el edificio tiene ascensor y el apartamento está en primera planta, así que no hay escaleras con las maletas. Todo el día a día está llano y a un paseo, algo que agradecen quienes prefieren no conducir.',
    },
    {
      q: '¿Con cuánta antelación conviene reservar?',
      a: 'Para julio y agosto, entre tres y seis meses; el Arenal se llena. Semana Santa y los puentes también vuelan, sobre todo el de mayo y el 9 d\'Octubre. El resto del año suele haber más margen y muchas veces se puede a última hora: pregúntanos.',
    },
    {
      q: '¿Se admiten mascotas?',
      a: 'No, no podemos admitir mascotas. La entrada es a partir de las 16:00 y la salida antes de las 12:00; si tus horarios de vuelo lo complican, dínoslo y vemos qué se puede hacer.',
    },
  ],
  it: [
    {
      q: "Quanto dista l'appartamento dalla spiaggia dell'Arenal?",
      a: '250 metri, circa 3 minuti a piedi. Spiaggia, lungomare e i ristoranti dell\'Arenal si raggiungono a piedi, senza mai riprendere l\'auto.',
    },
    {
      q: "Come si arriva a Jávea dall'aeroporto?",
      a: "Alicante (ALC) è di solito la scelta migliore: circa 100 km, poco più di un'ora sull'AP-7. Valencia è a distanza simile, circa un'ora e mezza. Ci sono voli diretti da Milano, Bergamo e Roma in circa 2 ore. Autonoleggio, taxi e navette arrivano a Jávea; dicci l'orario di arrivo e ti indichiamo la soluzione più comoda.",
    },
    {
      q: 'Serve la macchina a Jávea?',
      a: "Per una vacanza al mare no. Spiaggia, supermercati, farmacia e una ventina di ristoranti sono entro 10 minuti a piedi. L'auto è utile per le gite — Cala Granadella, il centro storico, Dénia o Calpe — e se la porti è incluso un posto auto gratuito: una vera rarità così vicino all'Arenal.",
    },
    {
      q: 'Per quante persone è l\'appartamento?',
      a: "Per quattro, in due camere: una matrimoniale e una con due letti singoli. Il divano del soggiorno si trasforma in letto singolo se serve un quinto posto. Il bagno è uno, quindi è ideale per una famiglia o due coppie.",
    },
    {
      q: 'Conviene prenotare direttamente invece che su Airbnb o Booking?',
      a: "Sì. Prenotando da questo sito non paghi le commissioni di servizio del portale, che sulle grandi piattaforme arrivano al 12–15% del totale. Tratti direttamente con il proprietario, quindi a rispondere è chi conosce davvero l'appartamento.",
    },
    {
      q: 'Il calendario segna le mie date come occupate: è definitivo?',
      a: "Non sempre. Il calendario si sincronizza con Airbnb, e Airbnb a volte blocca giorni in realtà liberi. Scrivici lo stesso le tue date: spesso possiamo accettare una prenotazione diretta in giorni che risultano bloccati.",
    },
    {
      q: 'Accettate soggiorni lunghi e affitti invernali?',
      a: "Sì, ed è una parte importante della nostra attività. Da 35 notti in su la tariffa è di 100 € a notte per tutto il soggiorno, in qualsiasi stagione. Ci sono riscaldamento oltre all'aria condizionata, fibra da 600 Mbps, lavatrice e cucina completa: adatto a un mese o tre, non solo a una settimana.",
    },
    {
      q: "C'è l'ascensore? È adatto a ospiti anziani?",
      a: "Sì — il palazzo ha l'ascensore e l'appartamento è al primo piano, quindi niente scale con le valigie. Tutto il quotidiano è in piano e raggiungibile a piedi, cosa che apprezza chi preferisce non guidare.",
    },
    {
      q: 'Con quanto anticipo conviene prenotare?',
      a: "Per luglio e agosto, tre-sei mesi: l'Arenal si riempie, e Ferragosto va via presto. Anche Pasqua e i ponti spagnoli si esauriscono in fretta. Nel resto dell'anno di solito c'è più margine e spesso si riesce anche all'ultimo — basta chiedere.",
    },
    {
      q: 'Sono ammessi animali?',
      a: "No, non possiamo accogliere animali. Il check-in è dalle 16:00 e il check-out entro le 12:00; se gli orari dei voli complicano le cose, dicci pure e vediamo cosa possiamo fare.",
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

const eyebrows: Record<string, string> = {
  en: 'Good to know',
  nl: 'Goed om te weten',
  fr: 'Bon à savoir',
  de: 'Gut zu wissen',
  es: 'Conviene saber',
  it: 'Da sapere',
};

const FAQSection = () => {
  const { language } = useLanguage();
  const items = faqs[language as keyof typeof faqs] || faqs.en;
  const title = titles[language] || titles.en;
  const eyebrow = eyebrows[language] || eyebrows.en;

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
    <section className="section bg-bone" id="faq" data-testid="section-faq">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-5">{eyebrow}</p>
              <h2 className="display-lg">{title}</h2>
            </div>
          </div>

          <div
            itemScope
            itemType="https://schema.org/FAQPage"
            className="lg:col-span-8 border-t border-ink/12"
          >
            {items.map((item, i) => (
              <div
                key={i}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className="border-b border-ink/12 py-8"
              >
                <h3 itemProp="name" className="font-display text-xl md:text-[1.4rem] text-ink mb-3">
                  {item.q}
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text" className="text-[0.95rem] text-ink-soft leading-relaxed max-w-2xl">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

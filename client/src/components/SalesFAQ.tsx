import type { Language } from "@/contexts/LanguageContext";

import { salesFAQ as content } from "@shared/sales-faq";

const contactSubjects: Record<Language, string> = {
  fr: "Demande d'information Javeabliss / de visite",
  en: "Information / viewing request for Javeabliss",
  es: "Solicitud de información / visita de Javeabliss",
  de: "Informations- / Besichtigungsanfrage zu Javeabliss",
  nl: "Aanvraag voor informatie / bezichtiging van Javeabliss",
  it: "Richiesta di informazioni / visita di Javeabliss",
};

const contactBodies: Record<Language, string> = {
  fr: `Bonjour,

Je m’appelle [prénom et nom] et je suis intéressé(e) par votre appartement Jávea Bliss.

Je vous contacte en tant que [acheteur particulier / agence immobilière — nom de l’agence].

Je souhaiterais organiser une visite [pour moi-même / accompagné(e) d’un prospect (client)].

Mes disponibilités sont :
- [date et heure souhaitées]
- [autre créneau possible]

Vous pouvez me joindre par téléphone ou WhatsApp au [numéro avec indicatif international].

Merci de me confirmer le créneau qui vous conviendrait.

Bien cordialement,
[prénom et nom]`,
  en: `Hello,

My name is [first and last name] and I am interested in your Jávea Bliss apartment.

I am contacting you as a [private buyer / estate agency — agency name].

I would like to arrange a viewing [for myself / accompanied by a prospective buyer (client)].

I am available at the following times:
- [preferred date and time]
- [alternative date and time]

You can reach me by phone or WhatsApp at [number including international dialling code].

Please let me know which time would suit you.

Kind regards,
[first and last name]`,
  es: `Hola:

Me llamo [nombre y apellidos] y estoy interesado/a en su apartamento Jávea Bliss.

Me pongo en contacto como [comprador particular / agencia inmobiliaria — nombre de la agencia].

Me gustaría concertar una visita [para mí / acompañado/a de un posible comprador (cliente)].

Mi disponibilidad es:
- [fecha y hora preferidas]
- [otra fecha y hora posibles]

Puede contactar conmigo por teléfono o WhatsApp en el [número con prefijo internacional].

Le agradecería que me confirmara qué horario le conviene.

Un cordial saludo,
[nombre y apellidos]`,
  de: `Guten Tag,

mein Name ist [Vor- und Nachname] und ich interessiere mich für Ihre Wohnung Jávea Bliss.

Ich kontaktiere Sie als [privater Käufer / Immobilienagentur — Name der Agentur].

Ich möchte eine Besichtigung vereinbaren [für mich selbst / gemeinsam mit einem Kaufinteressenten (Kunden)].

Ich bin zu folgenden Zeiten verfügbar:
- [gewünschtes Datum und Uhrzeit]
- [alternativer Termin]

Sie erreichen mich telefonisch oder per WhatsApp unter [Telefonnummer mit internationaler Vorwahl].

Bitte teilen Sie mir mit, welcher Termin Ihnen passt.

Mit freundlichen Grüßen
[Vor- und Nachname]`,
  nl: `Beste eigenaar,

Mijn naam is [voor- en achternaam] en ik ben geïnteresseerd in uw appartement Jávea Bliss.

Ik neem contact met u op als [particuliere koper / makelaarskantoor — naam van het kantoor].

Ik zou graag een bezichtiging plannen [voor mijzelf / samen met een potentiële koper (klant)].

Ik ben beschikbaar op:
- [gewenste datum en tijd]
- [alternatieve datum en tijd]

U kunt mij telefonisch of via WhatsApp bereiken op [nummer met internationale landcode].

Wilt u laten weten welk tijdstip u schikt?

Met vriendelijke groet,
[voor- en achternaam]`,
  it: `Buongiorno,

Mi chiamo [nome e cognome] e sono interessato/a al vostro appartamento Jávea Bliss.

Vi contatto in qualità di [acquirente privato / agenzia immobiliare — nome dell’agenzia].

Vorrei organizzare una visita [per me / accompagnato/a da un potenziale acquirente (cliente)].

Le mie disponibilità sono:
- [data e ora preferite]
- [altra data e ora possibili]

Potete contattarmi per telefono o WhatsApp al [numero con prefisso internazionale].

Vi ringrazio se potete confermarmi l’orario più comodo per voi.

Cordiali saluti,
[nome e cognome]`,
};

function contactEmailHref(language: Language) {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const date = `${pad(now.getFullYear() % 100)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `mailto:admin@javeabliss.com?subject=${encodeURIComponent(`${contactSubjects[language]} [${date}-${time}]`)}&body=${encodeURIComponent(contactBodies[language].replace(/\n/g, "\r\n"))}`;
}

export default function SalesFAQ({ language }: { language: Language }) {
  const t = content[language];
  return (
    <section id="buyer-questions" aria-labelledby="buyer-questions-title" className="border-t border-[#c9c2b6] bg-[#f4f0e8] px-6 py-16 text-[#24352f] md:px-12 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.65fr_1fr] lg:gap-16">
        <div>
          <h2 id="buyer-questions-title" className="font-serif text-4xl leading-tight md:text-5xl">{t.title}</h2>
          <p className="mt-6 text-sm leading-7 text-[#68756e]">{t.intro}</p>
        </div>
        <div className="divide-y divide-[#c9c2b6] border-y border-[#c9c2b6]">
          {t.items.map(([question, answer]) => (
            <article key={question} className="py-6">
              <h3 className="font-serif text-xl leading-snug md:text-2xl">{question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#53635c]">{answer.split("admin@javeabliss.com").map((part, index) => <span key={index}>{index > 0 && <a href={contactEmailHref(language)} onClick={(event) => { event.currentTarget.href = contactEmailHref(language); }} className="underline underline-offset-4 hover:text-[#24352f]">admin@javeabliss.com</a>}{part}</span>)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

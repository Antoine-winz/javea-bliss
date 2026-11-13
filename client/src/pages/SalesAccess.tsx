import LanguageSwitcher from "@/components/LanguageSwitcher";
import SaleTurnkey from "@/components/SaleTurnkey";
import SaleStory from "@/components/SaleStory";
import { saleContent } from "@shared/sale-content";
import SalesFAQ from "@/components/SalesFAQ";
import SalesGallery from "@/components/SalesGallery";
import { FormEvent, useEffect, useMemo, useState, useId, useRef, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Download, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { normalizeSalesPhone } from "@shared/sales-phone";
import apartmentImage from "@assets/javea-bliss-living-room-hero.jpeg";
import terraceImage from "@assets/Terasse1.3_1749116725138.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IdealistaLink } from "@/components/IdealistaListing";

type Lang = "en" | "fr" | "es" | "de" | "nl" | "it";
type Step = "landing" | "form" | "verify" | "success";
const langs: Lang[] = ["en", "fr", "es", "de", "nl", "it"];
const copy: Record<Lang, Record<string, string>> = {
  en: { eyebrow: "Apartment for sale", title: "Apartment for sale in Jávea.", intro: "Discover Jávea Bliss, a renovated two-bedroom apartment for sale near Arenal Beach.", note: "View the public listing on Idealista, or request a personalised brochure for more details.", request: "Request the brochure and schedule a visit", formTitle: "Tell us a little about yourself", formIntro: "Your details are held privately and used only to arrange access to this presentation.", first: "First name", last: "Last name", email: "Email address", phone: "Phone number", buyer: "I am enquiring as", private: "Private buyer", agency: "Agency / representative", agencyName: "Agency name", language: "Presentation language", consent: "I agree to the privacy policy and to be contacted about this private presentation.", send: "Send access request", codeTitle: "Check your inbox", codeIntro: "We sent a six-digit access code to your email.", code: "Access code", verify: "Verify access", resend: "Resend code", successTitle: "Your private presentation is ready.", successIntro: "Thank you. Choose a language to download your personalised brochure.", download: "Download brochure", back: "Back to Jávea Bliss", error: "Something went wrong. Please try again.", required: "Please complete this field." },
  fr: { eyebrow: "Appartement à vendre", title: "Appartement à vendre à Jávea.", intro: "Découvrez Jávea Bliss, un appartement rénové de deux chambres à vendre près de la plage de l’Arenal.", note: "Consultez l’annonce publique sur Idealista ou demandez une brochure personnalisée pour en savoir plus.", request: "Demander la brochure et organiser une visite", formTitle: "Parlez-nous un peu de vous", formIntro: "Vos coordonnées restent confidentielles et servent uniquement à organiser votre accès.", first: "Prénom", last: "Nom", email: "Adresse e-mail", phone: "Téléphone", buyer: "Je me renseigne en tant que", private: "Acheteur privé", agency: "Agence / représentant", agencyName: "Nom de l’agence", language: "Langue de présentation", consent: "J’accepte la politique de confidentialité et d’être contacté au sujet de cette présentation privée.", send: "Envoyer la demande", codeTitle: "Consultez votre boîte mail", codeIntro: "Nous avons envoyé un code d’accès à six chiffres.", code: "Code d’accès", verify: "Vérifier l’accès", resend: "Renvoyer le code", successTitle: "Votre présentation privée est prête.", successIntro: "Merci. Choisissez une langue pour télécharger votre brochure personnalisée.", download: "Télécharger la brochure", back: "Retour à Jávea Bliss", error: "Une erreur est survenue. Veuillez réessayer.", required: "Champ obligatoire." },
  es: { eyebrow: "Apartamento en venta", title: "Apartamento en venta en Jávea.", intro: "Descubra Jávea Bliss, un apartamento reformado de dos dormitorios en venta cerca de la playa del Arenal.", note: "Consulte el anuncio público en Idealista o solicite un folleto personalizado para más información.", request: "Solicitar el folleto y concertar una visita", formTitle: "Cuéntenos un poco sobre usted", formIntro: "Sus datos se mantienen privados y se utilizan únicamente para organizar el acceso.", first: "Nombre", last: "Apellidos", email: "Correo electrónico", phone: "Teléfono", buyer: "Estoy interesado como", private: "Comprador particular", agency: "Agencia / representante", agencyName: "Nombre de la agencia", language: "Idioma de la presentación", consent: "Acepto la política de privacidad y ser contactado sobre esta presentación privada.", send: "Enviar solicitud", codeTitle: "Revise su correo", codeIntro: "Hemos enviado un código de acceso de seis dígitos.", code: "Código de acceso", verify: "Verificar acceso", resend: "Reenviar código", successTitle: "Su presentación privada está lista.", successIntro: "Gracias. Elija un idioma para descargar su folleto personalizado.", download: "Descargar folleto", back: "Volver a Jávea Bliss", error: "Algo salió mal. Inténtelo de nuevo.", required: "Campo obligatorio." },
  de: { eyebrow: "Wohnung zu verkaufen", title: "Wohnung kaufen in Jávea.", intro: "Entdecken Sie Jávea Bliss: eine renovierte Wohnung mit zwei Schlafzimmern zum Verkauf nahe dem Arenal-Strand.", note: "Sehen Sie sich das öffentliche Inserat auf Idealista an oder fordern Sie eine personalisierte Broschüre mit weiteren Informationen an.", request: "Broschüre anfordern und Besichtigung vereinbaren", formTitle: "Erzählen Sie uns etwas über sich", formIntro: "Ihre Angaben werden vertraulich behandelt und nur für den Zugang verwendet.", first: "Vorname", last: "Nachname", email: "E-Mail-Adresse", phone: "Telefon", buyer: "Ich interessiere mich als", private: "Privater Käufer", agency: "Agentur / Vertreter", agencyName: "Name der Agentur", language: "Sprache der Präsentation", consent: "Ich akzeptiere die Datenschutzrichtlinie und die Kontaktaufnahme zu dieser privaten Präsentation.", send: "Anfrage senden", codeTitle: "Bitte prüfen Sie Ihren Posteingang", codeIntro: "Wir haben einen sechsstelligen Zugangscode gesendet.", code: "Zugangscode", verify: "Zugang bestätigen", resend: "Code erneut senden", successTitle: "Ihre private Präsentation ist bereit.", successIntro: "Vielen Dank. Wählen Sie eine Sprache für den Download.", download: "Broschüre herunterladen", back: "Zurück zu Jávea Bliss", error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.", required: "Pflichtfeld." },
  nl: { eyebrow: "Appartement te koop", title: "Appartement te koop in Jávea.", intro: "Ontdek Jávea Bliss: een gerenoveerd appartement met twee slaapkamers te koop nabij het Arenal-strand.", note: "Bekijk de openbare advertentie op Idealista of vraag een persoonlijke brochure aan voor meer informatie.", request: "Brochure aanvragen en een bezichtiging plannen", formTitle: "Vertel ons iets over uzelf", formIntro: "Uw gegevens worden vertrouwelijk behandeld en alleen gebruikt om toegang te regelen.", first: "Voornaam", last: "Achternaam", email: "E-mailadres", phone: "Telefoon", buyer: "Ik informeer als", private: "Particuliere koper", agency: "Makelaar / vertegenwoordiger", agencyName: "Naam van bureau", language: "Taal van presentatie", consent: "Ik ga akkoord met het privacybeleid en contact over deze privépresentatie.", send: "Aanvraag versturen", codeTitle: "Controleer uw inbox", codeIntro: "We hebben een zescijferige toegangscode gestuurd.", code: "Toegangscode", verify: "Toegang verifiëren", resend: "Code opnieuw sturen", successTitle: "Uw privépresentatie staat klaar.", successIntro: "Dank u. Kies een taal om uw brochure te downloaden.", download: "Brochure downloaden", back: "Terug naar Jávea Bliss", error: "Er ging iets mis. Probeer het opnieuw.", required: "Verplicht veld." },
  it: { eyebrow: "Appartamento in vendita", title: "Appartamento in vendita a Jávea.", intro: "Scopra Jávea Bliss, un appartamento ristrutturato con due camere da letto in vendita vicino alla spiaggia dell’Arenal.", note: "Consulti l’annuncio pubblico su Idealista o richieda una brochure personalizzata per maggiori informazioni.", request: "Richiedi la brochure e prenota una visita", formTitle: "Ci racconti qualcosa di sé", formIntro: "I suoi dati restano riservati e vengono usati solo per organizzare l’accesso.", first: "Nome", last: "Cognome", email: "E-mail", phone: "Telefono", buyer: "Mi informo come", private: "Acquirente privato", agency: "Agenzia / rappresentante", agencyName: "Nome dell’agenzia", language: "Lingua della presentazione", consent: "Accetto la privacy policy e di essere contattato per questa presentazione privata.", send: "Invia richiesta", codeTitle: "Controlli la posta", codeIntro: "Abbiamo inviato un codice di accesso di sei cifre.", code: "Codice di accesso", verify: "Verifica accesso", resend: "Invia di nuovo", successTitle: "La sua presentazione privata è pronta.", successIntro: "Grazie. Scelga una lingua per scaricare la brochure personalizzata.", download: "Scarica brochure", back: "Torna a Jávea Bliss", error: "Qualcosa è andato storto. Riprovi.", required: "Campo obbligatorio." },
};
const saleFacts: Record<Lang, string> = {"en": "80 m² · 2 bedrooms · 1 bathroom · Lift", "fr": "80 m² · 2 chambres · 1 salle de bains · Ascenseur", "es": "80 m² · 2 dormitorios · 1 baño · Ascensor", "de": "80 m² · 2 Schlafzimmer · 1 Bad · Aufzug", "nl": "80 m² · 2 slaapkamers · 1 badkamer · Lift", "it": "80 m² · 2 camere · 1 bagno · Ascensore"};
const saleLocation: Record<Lang, string> = {"en": "El Arenal, Costa Blanca · Approx. 250 m from the beach", "fr": "El Arenal, Costa Blanca · À environ 250 m de la plage", "es": "El Arenal, Costa Blanca · A unos 250 m de la playa", "de": "El Arenal, Costa Blanca · Ca. 250 m zum Strand", "nl": "El Arenal, Costa Blanca · Ca. 250 m van het strand", "it": "El Arenal, Costa Blanca · A circa 250 m dalla spiaggia"};
const imageDescriptions: Record<Lang, { living: string; terrace: string; callingCode: string }> = {"en": {"living": "The living room at Jávea Bliss", "terrace": "Covered balcony at Jávea Bliss", "callingCode": "Country calling code"}, "fr": {"living": "Le salon de l’appartement Jávea Bliss", "terrace": "Balcon couvert de Jávea Bliss", "callingCode": "Indicatif téléphonique"}, "es": {"living": "El salón del apartamento Jávea Bliss", "terrace": "Balcón cubierto de Jávea Bliss", "callingCode": "Prefijo telefónico"}, "de": {"living": "Das Wohnzimmer der Wohnung Jávea Bliss", "terrace": "Überdachter Balkon von Jávea Bliss", "callingCode": "Ländervorwahl"}, "nl": {"living": "De woonkamer van het appartement Jávea Bliss", "terrace": "Overdekt balkon van Jávea Bliss", "callingCode": "Landnummer"}, "it": {"living": "Il soggiorno dell’appartamento Jávea Bliss", "terrace": "Balcone coperto di Jávea Bliss", "callingCode": "Prefisso internazionale"}};
const countries = ["+34", "+33", "+31", "+44", "+49", "+39", "+1", "+41", "+32"];

export default function SalesAccess() {
  const [location] = useLocation();
  const pathLanguage = location.split("/").filter(Boolean)[0];
  const lang = (langs.includes(pathLanguage as Lang) ? pathLanguage : "en") as Lang;
  const t = copy[lang];
  const mainRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState<Step>("landing");
  const previousStep = useRef<Step>("landing");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", buyerType: "private", agencyName: "", preferredLanguage: lang, consentGiven: false, country: "+34" });
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    window.scrollTo({ top: 0, behavior: "instant" });
    const heading = mainRef.current?.querySelector("h1");
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
  }, [step]);
  const [code, setCode] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [resendIn, setResendIn] = useState(0); const [downloadLang, setDownloadLang] = useState<Lang>(lang);
  useEffect(() => {
    if (step !== "landing" || !window.location.hash) return;
    try {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView({ behavior: "instant" });
    } catch { /* Ignore malformed fragments in old shared links. */ }
  }, [step, location]);
  useEffect(() => {
    setForm(current => ({ ...current, preferredLanguage: lang }));
    setDownloadLang(lang);
    setError("");
  }, [lang]);
  const [accessToken, setAccessToken] = useState(() => { try { return window.sessionStorage.getItem("jb_sales_access_token") || ""; } catch { return ""; } });
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/sales/session", { signal: controller.signal, credentials: "include", headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined })
      .then(async response => {
        if (!response.ok) return;
        const session = await response.json();
        if (controller.signal.aborted) return;
        if (session?.verified === true) {
          const preferredLanguage = session.lead?.preferredLanguage;
          if (preferredLanguage && langs.includes(preferredLanguage)) {
            setDownloadLang(preferredLanguage);
            setForm(current => ({ ...current, preferredLanguage }));
          }
          setStep("success");
        } else if (accessToken) {
          try { window.sessionStorage.removeItem("jb_sales_access_token"); } catch { /* Storage may be disabled. */ }
          setAccessToken("");
          setStep(current => current === "success" ? "landing" : current);
        }
      }).catch(() => undefined);
    return () => controller.abort();
  }, [accessToken]);
  useEffect(() => { if (!resendIn) return; const timer = window.setInterval(() => setResendIn((n) => Math.max(0, n - 1)), 1000); return () => window.clearInterval(timer); }, [resendIn]);
  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (busy) return; setError("");
    if (![form.firstName, form.lastName, form.email, form.phone].every(value => value.trim()) || !form.consentGiven || (form.buyerType === "agency" && !form.agencyName.trim())) { setError(t.required); return; }
    const phone = normalizeSalesPhone(form.phone, form.country);
    if (!phone) { setError(phoneError(lang)); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/sales/request-access", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ ...form, email: form.email.trim(), buyerType: form.buyerType === "private" ? "private_buyer" : "agency", phone }) });
      if (!response.ok) { setError(await salesError(response, lang, "request")); return; }
      if ((await response.json()).ok !== true) throw new Error("Invalid registration response");
      setStep("verify"); setCode(""); setResendIn(60);
    } catch { setError(t.error); } finally { setBusy(false); }
  };
  const verify = async (event: FormEvent) => {
    event.preventDefault(); if (busy || code.length !== 6) return; setBusy(true); setError("");
    try {
      const response = await fetch("/api/sales/verify", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: form.email.trim(), code }) });
      if (!response.ok) { setError(await salesError(response, lang, "verify")); return; }
      const token = response.headers.get("X-Sales-Access-Token");
      if ((await response.json()).ok !== true || !token) throw new Error("Invalid verification response");
      try { window.sessionStorage.setItem("jb_sales_access_token", token); } catch { /* Use in-memory access when storage is disabled. */ }
      setAccessToken(token); setStep("success");
    } catch { setError(t.error); } finally { setBusy(false); }
  };
  const resend = async () => {
    if (resendIn || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/sales/resend", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: form.email.trim() }) });
      if (!response.ok) { setError(await salesError(response, lang, "request")); return; }
      setResendIn(60);
    } catch { setError(t.error); } finally { setBusy(false); }
  };
  const download = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/sales/brochure?lang=${downloadLang}`, {
        credentials: "include",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (!response.ok) {
        setError(await salesError(response, lang, "brochure"));
        if (response.status === 401 || response.status === 409) {
          try { window.sessionStorage.removeItem("jb_sales_access_token"); } catch { /* Storage may be disabled. */ }
          setAccessToken(""); setCode(""); setStep("form");
        }
        return;
      }
      const bytes = await response.arrayBuffer();
      const signature = new TextDecoder().decode(bytes.slice(0, 5));
      if (signature !== "%PDF-") {
        setError(await salesError(new Response(null, { status: 503 }), lang, "brochure"));
        return;
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `javea-bliss-private-presentation-${downloadLang}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      try { window.sessionStorage.removeItem("jb_sales_access_token"); } catch { /* Storage can be disabled. */ }
      setAccessToken("");
      setCode("");
      setStep("landing");
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  };
  const languageName = useMemo(() => ({ en: "English", fr: "Français", es: "Español", de: "Deutsch", nl: "Nederlands", it: "Italiano" }[downloadLang]), [downloadLang]);
  return <main ref={mainRef} className="sales-page min-h-[100dvh] bg-[#f4f0e8] text-[#24352f]">
    <header className="px-6 py-5 md:px-12"><div className="mx-auto flex max-w-6xl items-center justify-between"><Link href={`/${lang}/for-sale`} className="font-montserrat text-base md:text-sm tracking-[.22em] text-[#24352f]">JÁVEA BLISS</Link><div className="flex items-center gap-4"><span className="hidden sm:inline font-montserrat text-[10px] uppercase tracking-[.2em] text-[#5b6b62]">{t.eyebrow}</span><LanguageSwitcher /></div></div></header>
    {step === "landing" && <section id="sale-introduction" className="px-6 pb-16 pt-6 md:px-12 md:pb-20 md:pt-8"><div className="mx-auto max-w-6xl"><p className="mb-5 font-montserrat text-[10px] uppercase tracking-[.28em] text-[#795b37]">{t.eyebrow}</p><h1 className="max-w-4xl font-serif text-4xl leading-[1.08] md:text-5xl">{saleContent[lang].title}</h1><div className="mt-8 grid items-center gap-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-12 xl:gap-16"><div className="min-w-0"><p className="max-w-md font-serif text-xl leading-relaxed text-[#53635c]">{t.intro}</p><div className="mt-6 space-y-2 text-base md:text-sm leading-6 text-[#53635c]"><p>{saleFacts[lang]}</p><p>{saleLocation[lang]}</p></div><p className="mt-6 max-w-sm border-l border-[#c7a981] pl-5 text-base md:text-sm leading-7 text-[#5b6b62]">{t.note}</p><div className="mt-8 grid w-full max-w-sm gap-3">
      <Button onClick={() => setStep("form")} className="sales-action h-auto min-h-14 w-full justify-between whitespace-normal rounded-none border border-transparent bg-[#24352f] px-6 py-4 text-left font-sans text-xs font-medium uppercase leading-5 tracking-[.12em] hover:bg-[#3a5148]">
        <span>{t.request}</span><ArrowRight className="ml-3 h-4 w-4 shrink-0" aria-hidden="true" />
      </Button>
      <IdealistaLink language={lang} className="sales-action inline-flex min-h-14 w-full items-center justify-between border border-[#24352f]/30 px-6 py-4 text-left font-sans text-xs font-medium uppercase leading-5 tracking-[.12em] text-[#24352f] transition-colors hover:bg-[#24352f] hover:text-[#f4f0e8]" />
    </div><div className="mt-6 flex items-center gap-3 text-sm text-[#5b6b62]"><LockKeyhole className="h-4 w-4 shrink-0 text-[#795b37]" /> {confidentialLabel(lang)}</div></div><div className="relative overflow-hidden"><img src={apartmentImage} alt={imageDescriptions[lang].living} width={1524} height={1401} className="block h-auto w-full" /><div className="absolute bottom-5 left-5 bg-[#24352f]/75 px-3 py-2 font-montserrat text-[10px] uppercase tracking-[.2em] text-[#f4f0e8]">Jávea · Costa Blanca</div></div></div></div></section>}
    {step === "landing" && <><SaleStory language={lang} /><SaleTurnkey language={lang} /><SalesGallery language={lang} /><SalesFAQ language={lang} /></>}
    {step === "form" && <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:px-12 lg:grid-cols-[.72fr_1fr] lg:py-20"><div><p className="font-montserrat text-[10px] uppercase tracking-[.25em] text-[#795b37]">{t.eyebrow}</p><h1 className="mt-5 font-serif text-5xl leading-none">{t.formTitle}</h1><p className="mt-6 max-w-sm text-base md:text-sm leading-7 text-[#5b6b62]">{t.formIntro}</p><img src={terraceImage} alt={imageDescriptions[lang].terrace} className="mt-12 hidden aspect-[4/3] w-full object-cover md:block" /></div><form onSubmit={submit} className="space-y-5 border-t border-[#c9c2b6] pt-7"><div className="grid gap-5 sm:grid-cols-2"><Field autoComplete="given-name" label={t.first} value={form.firstName} onChange={(v) => update("firstName", v)} /><Field autoComplete="family-name" label={t.last} value={form.lastName} onChange={(v) => update("lastName", v)} /></div><Field label={t.email} type="email" value={form.email} onChange={(v) => update("email", v)} /><div><Label htmlFor="sales-phone">{t.phone}</Label><div className="mt-2 flex gap-2"><select aria-label={imageDescriptions[lang].callingCode} value={form.country} onChange={(e) => update("country", e.target.value)} className="w-24 shrink-0 border border-[#c9c2b6] bg-transparent px-3 text-base md:text-sm">{countries.map((country) => <option key={country}>{country}</option>)}</select><Input id="sales-phone" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={30} required value={form.phone} onChange={(e) => update("phone", e.target.value)} className="min-w-0 rounded-none border-[#c9c2b6] bg-transparent py-5" /></div></div><div><Label htmlFor="sales-buyer-type">{t.buyer}</Label><select id="sales-buyer-type" value={form.buyerType} onChange={(e) => update("buyerType", e.target.value)} className="mt-2 w-full border border-[#c9c2b6] bg-transparent px-3 py-3 text-base md:text-sm"><option value="private">{t.private}</option><option value="agency">{t.agency}</option></select></div>{form.buyerType === "agency" && <Field autoComplete="organization" label={t.agencyName} value={form.agencyName} onChange={(v) => update("agencyName", v)} />}<label className="flex items-start gap-3 text-base md:text-sm leading-6 text-[#53635c]"><input type="checkbox" required checked={form.consentGiven} onChange={(e) => update("consentGiven", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#24352f]" /> <span>{t.consent} <Link href={`/${lang}/privacy-policy`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{privacyPolicyLabel(lang)}</Link></span></label><Button type="submit" disabled={busy} className="sales-action h-auto min-h-12 w-full whitespace-normal rounded-none bg-[#24352f] px-4 py-4 font-sans text-sm font-medium leading-6">{busy ? "…" : t.send}</Button></form></section>}
    {step === "verify" && <Centered><Mail className="h-6 w-6 text-[#795b37]" /><h1 className="mt-6 font-serif text-5xl">{t.codeTitle}</h1><p className="mt-5 max-w-sm text-base md:text-sm leading-7 text-[#5b6b62]">{t.codeIntro}</p><form onSubmit={verify} className="mt-8 w-full max-w-sm"><Label htmlFor="otp">{t.code}</Label><Input id="otp" inputMode="numeric" autoComplete="one-time-code" minLength={6} maxLength={6} pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="mt-2 rounded-none border-[#c9c2b6] bg-transparent py-6 text-center font-mono text-2xl tracking-[.5em]" /><Button disabled={busy || code.length !== 6} className="mt-5 w-full rounded-none bg-[#24352f] py-6">{t.verify}</Button></form><button onClick={resend} disabled={!!resendIn} className="min-h-11 mt-5 text-sm text-[#795b37] underline underline-offset-4">{resendIn ? `${t.resend} · ${resendIn}s` : t.resend}</button><button onClick={() => { setStep("form"); setCode(""); setError(""); }} className="min-h-11 mt-4 block text-sm text-[#5b6b62] underline underline-offset-4">{changeEmailLabel(lang)}</button></Centered>}
    {step === "success" && <Centered><ShieldCheck className="h-7 w-7 text-[#795b37]" /><h1 className="mt-6 max-w-xl font-serif text-5xl leading-none">{t.successTitle}</h1><p className="mt-6 max-w-md text-base md:text-sm leading-7 text-[#5b6b62]">{t.successIntro}</p><div className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:flex-row"><select value={downloadLang} onChange={(e) => setDownloadLang(e.target.value as Lang)} className="min-w-0 flex-1 border border-[#c9c2b6] bg-transparent px-3 text-base md:text-sm" aria-label={t.language}>{langs.map((item) => <option key={item} value={item}>{({ en: "English", fr: "Français", es: "Español", de: "Deutsch", nl: "Nederlands", it: "Italiano" } as Record<Lang, string>)[item]}</option>)}</select><Button onClick={download} disabled={busy} aria-label={`${t.download} — ${languageName}`} className="sales-action min-h-12 rounded-none bg-[#24352f] px-5"><Download className="mr-2 h-4 w-4" />{t.download}</Button></div><Link href={`/${lang}/for-sale`} className="mt-10 text-xs text-[#795b37] underline underline-offset-4">{t.back}</Link></Centered>}
    {error && <div role="alert" className="fixed bottom-5 left-4 right-4 mx-auto max-w-lg bg-[#8c4e42] px-5 py-3 text-base md:text-sm text-[#fff8ef]">{error}</div>}
    <footer className="border-t border-[#c9c2b6] px-6 py-6 text-center text-sm leading-6 text-[#5b6b62] md:px-12">
      © 2026 Jávea Bliss. {({ fr: "Tous droits réservés.", en: "All rights reserved.", es: "Todos los derechos reservados.", de: "Alle Rechte vorbehalten.", nl: "Alle rechten voorbehouden.", it: "Tutti i diritti riservati." })[lang]}
      <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2"><a href="mailto:admin@javeabliss.com" className="underline underline-offset-4">admin@javeabliss.com</a><Link href={`/${lang}/privacy-policy`} className="underline underline-offset-4">{privacyPolicyLabel(lang)}</Link></div>
    </footer>
  </main>;
}
function Field({ label, value, onChange, type = "text", autoComplete }: { label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) {
  const id = useId();
  return <div><Label htmlFor={id}>{label}</Label><Input id={id} required maxLength={type === "email" ? 320 : autoComplete === "organization" ? 160 : 80} autoComplete={type === "email" ? "email" : autoComplete} type={type} value={value} onChange={e => onChange(e.target.value)} className="mt-2 rounded-none border-[#c9c2b6] bg-transparent py-5" /></div>;
}
function Centered({ children }: { children: ReactNode }) { return <section className="flex min-h-[calc(100dvh-76px)] flex-col items-center justify-center px-6 py-16 text-center">{children}</section>; }
function changeEmailLabel(lang: Lang) { return ({ en: "Change email address", fr: "Modifier l’adresse e-mail", es: "Cambiar dirección de correo", de: "E-Mail-Adresse ändern", nl: "E-mailadres wijzigen", it: "Modifica indirizzo e-mail" } as Record<Lang, string>)[lang]; }
function privacyPolicyLabel(lang: Lang) { return ({ en: "Privacy policy", fr: "Politique de confidentialité", es: "Política de privacidad", de: "Datenschutzrichtlinie", nl: "Privacybeleid", it: "Informativa sulla privacy" } as Record<Lang, string>)[lang]; }
function confidentialLabel(lang: Lang) { return ({ en: "Personalised brochure · Email verification required", fr: "Brochure personnalisée · Vérification par e-mail", es: "Folleto personalizado · Verificación por correo", de: "Personalisierte Broschüre · E-Mail-Bestätigung erforderlich", nl: "Persoonlijke brochure · E-mailverificatie vereist", it: "Brochure personalizzata · Verifica e-mail richiesta" } as Record<Lang, string>)[lang]; }
function phoneError(lang: Lang) { return ({ en: "Enter a valid international phone number.", fr: "Saisissez un numéro international valide.", es: "Introduzca un número internacional válido.", de: "Geben Sie eine gültige internationale Telefonnummer ein.", nl: "Vul een geldig internationaal telefoonnummer in.", it: "Inserisca un numero di telefono internazionale valido." } as Record<Lang, string>)[lang]; }
async function salesError(response: Response, lang: Lang, context: "request" | "verify" | "brochure") {
  let code = "";
  try { const payload = await response.json(); code = String(payload.code || payload.error || "").toLowerCase(); } catch { /* Keep a calm generic message. */ }
  const messages: Record<Lang, Record<string, string>> = {
    en: { invalid: "That code is not correct.", expired: "That code has expired. Request a new one.", attempts: "Too many attempts. Please request a new code later.", cooldown: "Please wait before requesting another code.", unavailable: context === "brochure" ? "The presentation is temporarily unavailable." : "We could not send an email right now.", generic: "We could not complete that request." },
    fr: { invalid: "Ce code n’est pas correct.", expired: "Ce code a expiré. Demandez-en un nouveau.", attempts: "Trop de tentatives. Demandez un nouveau code plus tard.", cooldown: "Veuillez patienter avant de demander un autre code.", unavailable: context === "brochure" ? "La présentation est temporairement indisponible." : "L’e-mail ne peut pas être envoyé pour le moment.", generic: "Nous n’avons pas pu traiter la demande." },
    es: { invalid: "El código no es correcto.", expired: "El código ha caducado. Solicite uno nuevo.", attempts: "Demasiados intentos. Solicite un código nuevo más tarde.", cooldown: "Espere antes de solicitar otro código.", unavailable: context === "brochure" ? "La presentación no está disponible temporalmente." : "No hemos podido enviar el correo ahora.", generic: "No hemos podido completar la solicitud." },
    de: { invalid: "Der Code ist nicht korrekt.", expired: "Der Code ist abgelaufen. Fordern Sie einen neuen an.", attempts: "Zu viele Versuche. Fordern Sie später einen neuen Code an.", cooldown: "Bitte warten Sie, bevor Sie einen neuen Code anfordern.", unavailable: context === "brochure" ? "Die Präsentation ist vorübergehend nicht verfügbar." : "Die E-Mail konnte derzeit nicht gesendet werden.", generic: "Die Anfrage konnte nicht abgeschlossen werden." },
    nl: { invalid: "De code is niet juist.", expired: "De code is verlopen. Vraag een nieuwe aan.", attempts: "Te veel pogingen. Vraag later een nieuwe code aan.", cooldown: "Wacht even voordat u een nieuwe code aanvraagt.", unavailable: context === "brochure" ? "De presentatie is tijdelijk niet beschikbaar." : "We konden nu geen e-mail versturen.", generic: "We konden het verzoek niet voltooien." },
    it: { invalid: "Il codice non è corretto.", expired: "Il codice è scaduto. Ne richieda uno nuovo.", attempts: "Troppi tentativi. Richieda un nuovo codice più tardi.", cooldown: "Attenda prima di richiedere un altro codice.", unavailable: context === "brochure" ? "La presentazione non è temporaneamente disponibile." : "Non è possibile inviare l’e-mail in questo momento.", generic: "Non è stato possibile completare la richiesta." },
  };
  const text = messages[lang];
  if (code.includes("already_used") || code.includes("already")) {
    return ({
      en: "This download has already been used. Register again to request another copy.",
      fr: "Ce téléchargement a déjà été utilisé. Inscrivez-vous à nouveau pour demander une autre copie.",
      es: "Esta descarga ya se ha utilizado. Regístrese de nuevo para solicitar otra copia.",
      de: "Dieser Download wurde bereits verwendet. Registrieren Sie sich erneut, um ein weiteres Exemplar anzufordern.",
      nl: "Deze download is al gebruikt. Registreer u opnieuw om een nieuw exemplaar aan te vragen.",
      it: "Questo download è già stato utilizzato. Si registri nuovamente per richiedere un’altra copia.",
    } as Record<Lang, string>)[lang];
  }
  if (context === "brochure" && response.status === 401) {
    return ({
      en: "Your access session has expired. Please verify your email again.",
      fr: "Votre session d’accès a expiré. Veuillez vérifier à nouveau votre adresse e-mail.",
      es: "Su sesión de acceso ha caducado. Vuelva a verificar su correo electrónico.",
      de: "Ihre Zugangssitzung ist abgelaufen. Bitte bestätigen Sie Ihre E-Mail-Adresse erneut.",
      nl: "Uw toegangssessie is verlopen. Verifieer uw e-mailadres opnieuw.",
      it: "La sessione di accesso è scaduta. Verifichi nuovamente il suo indirizzo e-mail.",
    } as Record<Lang, string>)[lang];
  }
  if (code.includes("expired")) return text.expired;
  if (code.includes("attempt")) return text.attempts;
  if (code.includes("cooldown") || response.status === 429) return text.cooldown;
  if (code.includes("invalid") || code.includes("code")) return text.invalid;
  if (code.includes("email") || code.includes("mail") || code.includes("unavailable") || context === "brochure") return text.unavailable;
  return text.generic;
}

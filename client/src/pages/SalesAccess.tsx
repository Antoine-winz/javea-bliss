import { FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Download, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js";
import apartmentImage from "@assets/Livingroom1_optimized.jpeg";
import terraceImage from "@assets/Terasse1.3_1749116725138.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Lang = "en" | "fr" | "es" | "de" | "nl" | "it";
type Step = "landing" | "form" | "verify" | "success";
const langs: Lang[] = ["en", "fr", "es", "de", "nl", "it"];
const copy: Record<Lang, Record<string, string>> = {
  en: { eyebrow: "Private presentation", title: "A rare address, shared discreetly.", intro: "You are invited to request private access to the Jávea Bliss property presentation.", note: "A considered coastal home in Jávea, presented privately to a small circle of interested buyers.", request: "Request private access", formTitle: "Tell us a little about yourself", formIntro: "Your details are held privately and used only to arrange access to this presentation.", first: "First name", last: "Last name", email: "Email address", phone: "Phone number", buyer: "I am enquiring as", private: "Private buyer", agency: "Agency / representative", agencyName: "Agency name", language: "Presentation language", consent: "I agree to the privacy policy and to be contacted about this private presentation.", send: "Send access request", codeTitle: "Check your inbox", codeIntro: "We sent a six-digit access code to your email.", code: "Access code", verify: "Verify access", resend: "Resend code", successTitle: "Your private presentation is ready.", successIntro: "Thank you. Choose a language to download your personalised brochure.", download: "Download brochure", back: "Back to Jávea Bliss", error: "Something went wrong. Please try again.", required: "Please complete this field." },
  fr: { eyebrow: "Présentation privée", title: "Une adresse rare, partagée avec discrétion.", intro: "Vous êtes invité à demander l’accès privé à la présentation de Jávea Bliss.", note: "Une adresse côtière singulière à Jávea, présentée en toute confidentialité.", request: "Demander l’accès privé", formTitle: "Parlez-nous un peu de vous", formIntro: "Vos coordonnées restent confidentielles et servent uniquement à organiser votre accès.", first: "Prénom", last: "Nom", email: "Adresse e-mail", phone: "Téléphone", buyer: "Je me renseigne en tant que", private: "Acheteur privé", agency: "Agence / représentant", agencyName: "Nom de l’agence", language: "Langue de présentation", consent: "J’accepte la politique de confidentialité et d’être contacté au sujet de cette présentation privée.", send: "Envoyer la demande", codeTitle: "Consultez votre boîte mail", codeIntro: "Nous avons envoyé un code d’accès à six chiffres.", code: "Code d’accès", verify: "Vérifier l’accès", resend: "Renvoyer le code", successTitle: "Votre présentation privée est prête.", successIntro: "Merci. Choisissez une langue pour télécharger votre brochure personnalisée.", download: "Télécharger la brochure", back: "Retour à Jávea Bliss", error: "Une erreur est survenue. Veuillez réessayer.", required: "Champ obligatoire." },
  es: { eyebrow: "Presentación privada", title: "Una dirección especial, compartida con discreción.", intro: "Le invitamos a solicitar acceso privado a la presentación de Jávea Bliss.", note: "Una vivienda costera singular en Jávea, presentada de forma privada.", request: "Solicitar acceso privado", formTitle: "Cuéntenos un poco sobre usted", formIntro: "Sus datos se mantienen privados y se utilizan únicamente para organizar el acceso.", first: "Nombre", last: "Apellidos", email: "Correo electrónico", phone: "Teléfono", buyer: "Estoy interesado como", private: "Comprador particular", agency: "Agencia / representante", agencyName: "Nombre de la agencia", language: "Idioma de la presentación", consent: "Acepto la política de privacidad y ser contactado sobre esta presentación privada.", send: "Enviar solicitud", codeTitle: "Revise su correo", codeIntro: "Hemos enviado un código de acceso de seis dígitos.", code: "Código de acceso", verify: "Verificar acceso", resend: "Reenviar código", successTitle: "Su presentación privada está lista.", successIntro: "Gracias. Elija un idioma para descargar su folleto personalizado.", download: "Descargar folleto", back: "Volver a Jávea Bliss", error: "Algo salió mal. Inténtelo de nuevo.", required: "Campo obligatorio." },
  de: { eyebrow: "Private Präsentation", title: "Eine seltene Adresse, diskret geteilt.", intro: "Sie sind eingeladen, privaten Zugang zur Präsentation von Jávea Bliss anzufordern.", note: "Ein besonderes Zuhause an der Küste von Jávea, vertraulich vorgestellt.", request: "Privaten Zugang anfordern", formTitle: "Erzählen Sie uns etwas über sich", formIntro: "Ihre Angaben werden vertraulich behandelt und nur für den Zugang verwendet.", first: "Vorname", last: "Nachname", email: "E-Mail-Adresse", phone: "Telefon", buyer: "Ich interessiere mich als", private: "Privater Käufer", agency: "Agentur / Vertreter", agencyName: "Name der Agentur", language: "Sprache der Präsentation", consent: "Ich akzeptiere die Datenschutzrichtlinie und die Kontaktaufnahme zu dieser privaten Präsentation.", send: "Anfrage senden", codeTitle: "Bitte prüfen Sie Ihren Posteingang", codeIntro: "Wir haben einen sechsstelligen Zugangscode gesendet.", code: "Zugangscode", verify: "Zugang bestätigen", resend: "Code erneut senden", successTitle: "Ihre private Präsentation ist bereit.", successIntro: "Vielen Dank. Wählen Sie eine Sprache für den Download.", download: "Broschüre herunterladen", back: "Zurück zu Jávea Bliss", error: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.", required: "Pflichtfeld." },
  nl: { eyebrow: "Privépresentatie", title: "Een bijzonder adres, discreet gedeeld.", intro: "U bent uitgenodigd om privétoegang tot de Jávea Bliss-presentatie aan te vragen.", note: "Een bijzonder kustappartement in Jávea, vertrouwelijk gepresenteerd.", request: "Privétoegang aanvragen", formTitle: "Vertel ons iets over uzelf", formIntro: "Uw gegevens worden vertrouwelijk behandeld en alleen gebruikt om toegang te regelen.", first: "Voornaam", last: "Achternaam", email: "E-mailadres", phone: "Telefoon", buyer: "Ik informeer als", private: "Particuliere koper", agency: "Makelaar / vertegenwoordiger", agencyName: "Naam van bureau", language: "Taal van presentatie", consent: "Ik ga akkoord met het privacybeleid en contact over deze privépresentatie.", send: "Aanvraag versturen", codeTitle: "Controleer uw inbox", codeIntro: "We hebben een zescijferige toegangscode gestuurd.", code: "Toegangscode", verify: "Toegang verifiëren", resend: "Code opnieuw sturen", successTitle: "Uw privépresentatie staat klaar.", successIntro: "Dank u. Kies een taal om uw brochure te downloaden.", download: "Brochure downloaden", back: "Terug naar Jávea Bliss", error: "Er ging iets mis. Probeer het opnieuw.", required: "Verplicht veld." },
  it: { eyebrow: "Presentazione privata", title: "Un indirizzo raro, condiviso con discrezione.", intro: "La invitiamo a richiedere l’accesso privato alla presentazione Jávea Bliss.", note: "Una casa costiera speciale a Jávea, presentata in forma riservata.", request: "Richiedi accesso privato", formTitle: "Ci racconti qualcosa di sé", formIntro: "I suoi dati restano riservati e vengono usati solo per organizzare l’accesso.", first: "Nome", last: "Cognome", email: "E-mail", phone: "Telefono", buyer: "Mi informo come", private: "Acquirente privato", agency: "Agenzia / rappresentante", agencyName: "Nome dell’agenzia", language: "Lingua della presentazione", consent: "Accetto la privacy policy e di essere contattato per questa presentazione privata.", send: "Invia richiesta", codeTitle: "Controlli la posta", codeIntro: "Abbiamo inviato un codice di accesso di sei cifre.", code: "Codice di accesso", verify: "Verifica accesso", resend: "Invia di nuovo", successTitle: "La sua presentazione privata è pronta.", successIntro: "Grazie. Scelga una lingua per scaricare la brochure personalizzata.", download: "Scarica brochure", back: "Torna a Jávea Bliss", error: "Qualcosa è andato storto. Riprovi.", required: "Campo obbligatorio." },
};
const countries = ["+34", "+33", "+31", "+44", "+49", "+39", "+1", "+41", "+32"];

export default function SalesAccess() {
  const [location, setLocation] = useLocation();
  const pathLanguage = location.split("/").filter(Boolean)[0];
  const lang = (langs.includes(pathLanguage as Lang) ? pathLanguage : "en") as Lang;
  const t = copy[lang];
  const [step, setStep] = useState<Step>("landing");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", buyerType: "private", agencyName: "", preferredLanguage: lang, consentGiven: false, country: "+34" });
  const [code, setCode] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [resendIn, setResendIn] = useState(0); const [downloadLang, setDownloadLang] = useState<Lang>(lang);
  const [accessToken, setAccessToken] = useState(() => window.sessionStorage.getItem("jb_sales_access_token") || "");
  useEffect(() => {
    fetch("/api/sales/session", { credentials: "include", headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined })
      .then(async (response) => {
        if (!response.ok) return;
        const session = await response.json();
        if (session?.verified === true) {
          const preferredLanguage = session.lead?.preferredLanguage;
          if (preferredLanguage && langs.includes(preferredLanguage)) {
            setDownloadLang(preferredLanguage);
            setForm((current) => ({ ...current, preferredLanguage }));
          }
          setStep("success");
        }
      })
      .catch(() => undefined);
  }, [accessToken]);
  useEffect(() => { if (!resendIn) return; const timer = window.setInterval(() => setResendIn((n) => Math.max(0, n - 1)), 1000); return () => window.clearInterval(timer); }, [resendIn]);
  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(""); if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.consentGiven || (form.buyerType === "agency" && !form.agencyName)) { setError(t.required); return; } const internationalPhone = `${form.country}${form.phone.replace(/\D/g, "")}`; if (!isValidPhoneNumber(internationalPhone)) { setError(phoneError(lang)); return; } setBusy(true); try { const response = await fetch("/api/sales/request-access", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ ...form, buyerType: form.buyerType === "private" ? "private_buyer" : "agency", phone: internationalPhone }) }); if (!response.ok) { setError(await salesError(response, lang, "request")); return; } setStep("verify"); setResendIn(60); } catch { setError(t.error); } finally { setBusy(false); } };
  const verify = async (event: FormEvent) => { event.preventDefault(); setBusy(true); setError(""); try { const response = await fetch("/api/sales/verify", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: form.email, code }) }); if (!response.ok) { setError(await salesError(response, lang, "verify")); return; } const token = response.headers.get("X-Sales-Access-Token"); if (token) { window.sessionStorage.setItem("jb_sales_access_token", token); setAccessToken(token); } setStep("success"); } catch { setError(t.error); } finally { setBusy(false); } };
  const resend = async () => { if (resendIn) return; await fetch("/api/sales/resend", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ email: form.email }) }); setResendIn(60); };
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
      window.sessionStorage.removeItem("jb_sales_access_token");
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
  return <main className="min-h-[100dvh] bg-[#f4f0e8] text-[#24352f]">
    <header className="flex items-center justify-between px-6 py-5 md:px-12"><Link href={lang === "en" ? "/" : `/${lang}/`} className="font-montserrat text-sm tracking-[.22em] text-[#24352f]">JÁVEA BLISS</Link><span className="font-montserrat text-[10px] uppercase tracking-[.2em] text-[#68756e]">Private access · {lang.toUpperCase()}</span></header>
    {step === "landing" && <section className="grid min-h-[calc(100dvh-76px)] lg:grid-cols-[1.05fr_.95fr]"><div className="flex flex-col justify-center px-7 py-14 md:px-16 lg:px-24"><p className="mb-6 font-montserrat text-[10px] uppercase tracking-[.28em] text-[#a57a4c]">{t.eyebrow}</p><h1 className="max-w-xl font-serif text-5xl leading-[.98] md:text-7xl">{t.title}</h1><p className="mt-8 max-w-md font-serif text-xl leading-relaxed text-[#53635c]">{t.intro}</p><p className="mt-7 max-w-sm border-l border-[#c7a981] pl-5 text-sm leading-7 text-[#68756e]">{t.note}</p><Button onClick={() => setStep("form")} className="mt-10 w-fit rounded-none bg-[#24352f] px-7 py-6 font-montserrat text-xs uppercase tracking-[.16em] hover:bg-[#3a5148]">{t.request}<ArrowRight className="ml-4 h-4 w-4" /></Button><div className="mt-12 flex items-center gap-3 text-[11px] text-[#68756e]"><LockKeyhole className="h-4 w-4 text-[#a57a4c]" /> {confidentialLabel(lang)}</div></div><div className="relative min-h-[430px] overflow-hidden"><img src={apartmentImage} alt="The living room at Jávea Bliss" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-[#24352f]/10" /><div className="absolute bottom-7 left-7 font-montserrat text-[10px] uppercase tracking-[.2em] text-[#f4f0e8]">Jávea · Costa Blanca</div></div></section>}
    {step === "form" && <section className="mx-auto grid max-w-6xl gap-12 px-6 py-12 md:px-12 lg:grid-cols-[.72fr_1fr] lg:py-20"><div><p className="font-montserrat text-[10px] uppercase tracking-[.25em] text-[#a57a4c]">{t.eyebrow}</p><h1 className="mt-5 font-serif text-5xl leading-none">{t.formTitle}</h1><p className="mt-6 max-w-sm text-sm leading-7 text-[#68756e]">{t.formIntro}</p><img src={terraceImage} alt="Terrace at Jávea Bliss" className="mt-12 hidden aspect-[4/3] w-full object-cover md:block" /></div><form onSubmit={submit} className="space-y-5 border-t border-[#c9c2b6] pt-7"><div className="grid gap-5 sm:grid-cols-2"><Field label={t.first} value={form.firstName} onChange={(v) => update("firstName", v)} /><Field label={t.last} value={form.lastName} onChange={(v) => update("lastName", v)} /></div><Field label={t.email} type="email" value={form.email} onChange={(v) => update("email", v)} /><div><Label>{t.phone}</Label><div className="mt-2 flex gap-2"><select aria-label="Country code" value={form.country} onChange={(e) => update("country", e.target.value)} className="w-24 border border-[#c9c2b6] bg-transparent px-3 text-sm">{countries.map((country) => <option key={country}>{country}</option>)}</select><Input required value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-none border-[#c9c2b6] bg-transparent py-5" /></div></div><div><Label>{t.buyer}</Label><select value={form.buyerType} onChange={(e) => update("buyerType", e.target.value)} className="mt-2 w-full border border-[#c9c2b6] bg-transparent px-3 py-3 text-sm"><option value="private">{t.private}</option><option value="agency">{t.agency}</option></select></div>{form.buyerType === "agency" && <Field label={t.agencyName} value={form.agencyName} onChange={(v) => update("agencyName", v)} />}<label className="flex items-start gap-3 text-sm leading-6 text-[#53635c]"><input type="checkbox" checked={form.consentGiven} onChange={(e) => update("consentGiven", e.target.checked)} className="mt-1 accent-[#24352f]" /> <span>{t.consent} <Link href={lang === "en" ? "/privacy-policy" : `/${lang}/privacy-policy`} className="underline underline-offset-4">{privacyPolicyLabel(lang)}</Link></span></label><Button type="submit" disabled={busy} className="w-full rounded-none bg-[#24352f] py-6 font-montserrat text-xs uppercase tracking-[.16em]">{busy ? "…" : t.send}</Button></form></section>}
    {step === "verify" && <Centered><Mail className="h-6 w-6 text-[#a57a4c]" /><h1 className="mt-6 font-serif text-5xl">{t.codeTitle}</h1><p className="mt-5 max-w-sm text-sm leading-7 text-[#68756e]">{t.codeIntro}</p><form onSubmit={verify} className="mt-8 w-full max-w-sm"><Label htmlFor="otp">{t.code}</Label><Input id="otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="mt-2 rounded-none border-[#c9c2b6] bg-transparent py-6 text-center font-mono text-2xl tracking-[.5em]" /><Button disabled={busy} className="mt-5 w-full rounded-none bg-[#24352f] py-6">{t.verify}</Button></form><button onClick={resend} disabled={!!resendIn} className="mt-5 text-xs text-[#a57a4c] underline underline-offset-4">{resendIn ? `${t.resend} · ${resendIn}s` : t.resend}</button><button onClick={() => { setStep("form"); setCode(""); setError(""); }} className="mt-4 block text-xs text-[#68756e] underline underline-offset-4">{changeEmailLabel(lang)}</button></Centered>}
    {step === "success" && <Centered><ShieldCheck className="h-7 w-7 text-[#a57a4c]" /><h1 className="mt-6 max-w-xl font-serif text-5xl leading-none">{t.successTitle}</h1><p className="mt-6 max-w-md text-sm leading-7 text-[#68756e]">{t.successIntro}</p><div className="mt-9 flex w-full max-w-sm gap-3"><select value={downloadLang} onChange={(e) => setDownloadLang(e.target.value as Lang)} className="flex-1 border border-[#c9c2b6] bg-transparent px-3 text-sm" aria-label={t.language}>{langs.map((item) => <option key={item} value={item}>{({ en: "English", fr: "Français", es: "Español", de: "Deutsch", nl: "Nederlands", it: "Italiano" } as Record<Lang, string>)[item]}</option>)}</select><Button onClick={download} disabled={busy} className="rounded-none bg-[#24352f] px-5"><Download className="mr-2 h-4 w-4" />{languageName}</Button></div><Link href={lang === "en" ? "/" : `/${lang}/`} className="mt-10 text-xs text-[#a57a4c] underline underline-offset-4">{t.back}</Link></Centered>}
    {error && <div role="alert" className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#8c4e42] px-5 py-3 text-sm text-[#fff8ef]">{error}</div>}
  </main>;
}
function Field({ label, value, onChange, type = "text", autoComplete }: { label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete?: string }) { const inferred = autoComplete || (type === "email" ? "email" : /first|prénom|nombre|vorname|voornaam|nome/i.test(label) ? "given-name" : /last|nom|apellidos|nachname|achternaam|cognome/i.test(label) ? "family-name" : undefined); return <div><Label>{label}</Label><Input required autoComplete={inferred} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 rounded-none border-[#c9c2b6] bg-transparent py-5" /></div>; }
function Centered({ children }: { children: ReactNode }) { return <section className="flex min-h-[calc(100dvh-76px)] flex-col items-center justify-center px-6 py-16 text-center">{children}</section>; }
function changeEmailLabel(lang: Lang) { return ({ en: "Change email address", fr: "Modifier l’adresse e-mail", es: "Cambiar dirección de correo", de: "E-Mail-Adresse ändern", nl: "E-mailadres wijzigen", it: "Modifica indirizzo e-mail" } as Record<Lang, string>)[lang]; }
function privacyPolicyLabel(lang: Lang) { return ({ en: "Privacy policy", fr: "Politique de confidentialité", es: "Política de privacidad", de: "Datenschutzrichtlinie", nl: "Privacybeleid", it: "Informativa sulla privacy" } as Record<Lang, string>)[lang]; }
function confidentialLabel(lang: Lang) { return ({ en: "Confidential by invitation", fr: "Confidentiel, sur invitation", es: "Confidencial, solo con invitación", de: "Vertraulich, nur auf Einladung", nl: "Vertrouwelijk, uitsluitend op uitnodiging", it: "Riservato, solo su invito" } as Record<Lang, string>)[lang]; }
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
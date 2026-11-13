import { Link, useLocation } from "wouter";
import { useState } from "react";
import { salesPrivacy } from "@shared/sales-privacy";
import { getAnalyticsConsent, setAnalyticsConsent } from "@/lib/analytics";

type Lang = "en" | "fr" | "es" | "de" | "nl" | "it";
const supported: Lang[] = ["en", "fr", "es", "de", "nl", "it"];

export default function SalesPrivacy() {
  const [location] = useLocation();
  const pathLanguage = location.split("/").filter(Boolean)[0];
  const lang = supported.includes(pathLanguage as Lang) ? pathLanguage as Lang : "en";
  const page = salesPrivacy[lang];
  const [analyticsChoice, setChoice] = useState(getAnalyticsConsent);
  const choose = (choice: "accepted" | "declined") => { setAnalyticsConsent(choice); setChoice(getAnalyticsConsent()); };
  return <main className="sales-page min-h-[100dvh] bg-[#f4f0e8] px-6 py-8 text-[#24352f] md:px-12">
    <header className="mx-auto flex max-w-4xl justify-between"><Link href={`/${lang}/for-sale`} className="font-montserrat text-base md:text-sm tracking-[.22em]">JÁVEA BLISS</Link><span className="font-montserrat text-[10px] uppercase tracking-[.2em] text-[#5b6b62]">{lang}</span></header>
    <article className="mx-auto max-w-3xl py-20"><p className="font-montserrat text-[10px] uppercase tracking-[.25em] text-[#795b37]">{privacyLabel(lang)}</p><h1 className="mt-5 max-w-2xl font-serif text-5xl leading-none md:text-6xl">{page.title}</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#5b6b62]">{page.intro}</p><div className="mt-14 border-t border-[#c9c2b6]">{page.sections.map(([heading, text]) => <section key={heading} className="border-b border-[#c9c2b6] py-7"><h2 className="font-serif text-2xl">{heading}</h2><p className="mt-3 max-w-2xl text-base md:text-sm leading-7 text-[#53635c]">{text}</p></section>)}</div><section className="mt-10 border border-[#c9c2b6] p-6" aria-labelledby="analytics-choice-title"><h2 id="analytics-choice-title" className="font-serif text-2xl">{page.gaTitle}</h2><p className="mt-3 text-base leading-7" role="status">{analyticsChoice === 'accepted' ? page.gaOn : page.gaOff}</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => choose('accepted')} className="min-h-12 border border-[#24352f] px-5 py-3 text-base">{page.accept}</button><button type="button" onClick={() => choose('declined')} className="min-h-12 border border-[#24352f] px-5 py-3 text-base">{page.reject}</button></div></section><a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer" className="mt-8 inline-block text-base underline underline-offset-4">{page.regulator}</a><br /><a href="mailto:admin@javeabliss.com" className="mt-10 inline-block text-base md:text-sm text-[#795b37] underline underline-offset-4">admin@javeabliss.com</a><br /><Link href={lang === "en" ? "/for-sale" : `/${lang}/for-sale`} className="mt-8 inline-block text-xs uppercase tracking-widest text-[#24352f] underline underline-offset-4">{page.back}</Link></article>
  </main>;
}

function privacyLabel(lang: Lang) {
  return ({
    en: "Privacy",
    fr: "Confidentialité",
    es: "Privacidad",
    de: "Datenschutz",
    nl: "Privacy",
    it: "Privacy",
  } as Record<Lang, string>)[lang];
}
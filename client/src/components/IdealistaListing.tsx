import { ArrowUpRight } from "lucide-react";
import { useLanguage,type Language } from "@/contexts/LanguageContext";

const LISTING_URL = "https://www.idealista.com/inmueble/112773313/";
const copy: Record<Language, { title: string; link: string }> = {
  en: { title: "Apartment for sale in Jávea", link: "View the listing on Idealista" },
  fr: { title: "Appartement à vendre à Jávea", link: "Voir l’annonce sur Idealista" },
  es: { title: "Apartamento en venta en Jávea", link: "Ver el anuncio en Idealista" },
  de: { title: "Wohnung in Jávea zu verkaufen", link: "Exposé auf Idealista ansehen" },
  nl: { title: "Appartement te koop in Jávea", link: "Bekijk de advertentie op Idealista" },
  it: { title: "Appartamento in vendita a Jávea", link: "Vedi l’annuncio su Idealista" },
};

export function IdealistaLink({ language, className = "btn-on-dark" }: { language: Language; className?: string }) {
  return (
    <a href={LISTING_URL} target="_blank" rel="noopener noreferrer" className={className}>
      {copy[language].link}
      <ArrowUpRight className="ml-3 h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

export default function IdealistaListing() {
  const { language } = useLanguage();
  return (
    <section className="bg-ink px-6 py-8 text-bone md:px-10" aria-labelledby="sale-listing-title">
      <div className="shell flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h2 id="sale-listing-title" className="font-display text-3xl text-bone md:text-4xl">
            {copy[language].title}
          </h2>
          <p className="mt-2 text-sm text-bone/80">El Arenal · Costa Blanca · Idealista</p>
        </div>
        <div className="flex flex-wrap items-center gap-4"><a className="btn-on-dark" href={`/${language}/for-sale`}>{copy[language].title}<ArrowUpRight className="ml-3 h-4 w-4" aria-hidden="true" /></a><IdealistaLink language={language} /></div>
      </div>
    </section>
  );
}

import { useLanguage,type Language } from "@/contexts/LanguageContext";
import { ArrowUpRight } from "lucide-react";

const copy: Record<Language, { title: string; open: string; note: string }> = {
  en: { title: "Apartment floor plan", open: "View full-size floor plan", note: "Schematic plan · Not to scale · Furniture for illustration" },
  fr: { title: "Plan de l’appartement", open: "Voir le plan en grand format", note: "Plan schématique · Sans échelle · Mobilier indicatif" },
  es: { title: "Plano del apartamento", open: "Ver plano en tamaño completo", note: "Plano esquemático · Sin escala · Mobiliario orientativo" },
  de: { title: "Grundriss der Wohnung", open: "Grundriss in voller Größe ansehen", note: "Schematischer Grundriss · Nicht maßstabsgetreu · Möblierung beispielhaft" },
  nl: { title: "Plattegrond van het appartement", open: "Bekijk de plattegrond op volledig formaat", note: "Schematische plattegrond · Niet op schaal · Meubilair ter illustratie" },
  it: { title: "Planimetria dell’appartamento", open: "Visualizza la planimetria a dimensione intera", note: "Pianta schematica · Non in scala · Arredi indicativi" },
};

export default function FloorPlan({ language }: { language?: Language }) {
  const context = useLanguage();
  const t = copy[language || context.language];
  return (
    <section id="floor-plan" aria-labelledby="floor-plan-title" className="bg-[#f4f0e8] px-6 py-16 text-[#24352f] md:px-12 md:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[.65fr_1fr] lg:gap-16">
        <div>
          <h2 id="floor-plan-title" className="font-serif text-4xl leading-tight md:text-5xl">{t.title}</h2>
          <p className="mt-6 text-sm leading-7 text-[#68756e]">{t.note}</p>
          <a href="/javeabliss-floor-plan-HD.png" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 border-b border-[#24352f]/40 pb-2 text-sm hover:text-[#a57a4c]">
            {t.open}<ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </a>
        </div>
        <a href="/javeabliss-floor-plan-HD.png" target="_blank" rel="noopener noreferrer" aria-label={t.open} className="block border border-[#c9c2b6] bg-white p-3 md:p-5">
          <img src="/javeabliss-floor-plan-HD.png" alt={t.title} width={3933} height={4096} loading="lazy" decoding="async" className="h-auto w-full object-contain" />
        </a>
      </div>
    </section>
  );
}

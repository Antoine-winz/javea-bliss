import type { Language } from "@/contexts/LanguageContext";

import { salesFAQ as content } from "@shared/sales-faq";

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
              <p className="mt-3 text-sm leading-7 text-[#53635c]">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

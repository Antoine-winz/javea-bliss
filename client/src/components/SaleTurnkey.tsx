import { RENTALS_ENABLED } from '@shared/site-access';
import { saleContent, type SaleLanguage } from '@shared/sale-content';
export default function SaleTurnkey({ language }: { language: SaleLanguage }) {
  const t = saleContent[language];
  return (
    <section className="border-t border-[#c9c2b6] bg-[#faf8f4] px-6 py-16 text-[#24352f] md:px-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-4xl md:text-5xl">{t.heading}</h2>
        <div className="mt-8 columns-1 gap-8 space-y-5 text-base leading-8 [column-fill:balance] md:columns-2 md:space-y-0 [&>p]:[orphans:1] [&>p]:[widows:1]">
          <p>{t.location}</p>
          <p className="md:indent-6">{t.inventory}</p>
          {t.equipment && <p className="md:indent-6">{t.equipment}</p>}
          {t.terms && <p className="text-base text-[#53635c] md:text-sm">{t.terms}</p>}
          {t.evidence && <p>{t.evidence}</p>}
        </div>
        {RENTALS_ENABLED && <a href={`/${language}/`} className="mt-8 inline-block border-b border-current pb-1">{t.rental} →</a>}
      </div>
    </section>
  );
}

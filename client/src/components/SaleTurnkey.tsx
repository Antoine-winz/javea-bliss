import { saleContent, type SaleLanguage } from '@shared/sale-content';
export default function SaleTurnkey({ language }: { language: SaleLanguage }) {
 const t = saleContent[language];
 return <section className="border-t border-[#c9c2b6] bg-[#faf8f4] px-6 py-16 text-[#24352f] md:px-12"><div className="mx-auto max-w-6xl"><h2 className="max-w-3xl font-serif text-4xl md:text-5xl">{t.heading}</h2><div className="mt-8 grid gap-8 text-base leading-8 md:grid-cols-2"><div><p>{t.inventory}</p><p className="mt-5">{t.location}</p></div><div><p>{t.evidence}</p><p className="mt-5 text-sm text-[#53635c]">{t.terms}</p></div></div><a href={`/${language}/`} className="mt-8 inline-block border-b border-current pb-1">{t.rental} →</a></div></section>;
}

import { saleContent, type SaleLanguage } from './sale-content';
import { salesFAQ } from './sales-faq';
const escape = (text: string) => text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
/** Visible initial content for all users, replaced by the interactive React page. */
export function saleInitialHTML(language: SaleLanguage): string {
  const t = saleContent[language], faq = salesFAQ[language];
  return `<main class="mx-auto max-w-6xl px-6 py-16 text-[#24352f]" data-sale-initial="true"><p>Jávea Bliss · Costa Blanca</p><h1 class="font-serif text-5xl">${escape(t.title)}</h1><p class="my-6 text-2xl">367 900 € · 80 m²</p><p>${escape(t.location)}</p><section class="py-10"><h2 class="font-serif text-3xl">${escape(t.heading)}</h2><p>${escape(t.inventory)}</p><p>${escape(t.evidence)}</p><p>${escape(t.terms)}</p><a class="underline" href="/${language}/">${escape(t.rental)}</a></section><a href="https://www.idealista.com/inmueble/112773313/" target="_blank" rel="noopener noreferrer">Idealista ↗</a><section id="floor-plan"><img src="/javeabliss-floor-plan-HD.png" loading="lazy" width="3933" height="4096" style="max-width:100%;height:auto" alt="Jávea Bliss" /></section><section id="buyer-questions"><h2 class="font-serif text-3xl">${escape(faq.title)}</h2><p>${escape(faq.intro)}</p>${faq.items.map(([q,a]) => `<article class="py-4"><h3 class="text-xl">${escape(q)}</h3><p>${escape(a)}</p></article>`).join('')}</section></main>`;
}

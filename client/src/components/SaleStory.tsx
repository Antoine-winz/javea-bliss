import type { SaleLanguage } from '@shared/sale-content';
import { saleStory } from '@shared/sale-story';
import kitchen from '@assets/javea-bliss-kitchen-story.jpeg';

export default function SaleStory({ language }: { language: SaleLanguage }) {
  const story = saleStory[language];
  return (
    <section id="our-story" aria-labelledby="sale-story-title" className="border-t border-[#c9c2b6] bg-[#f4f0e8] px-6 py-16 text-[#24352f] md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-5 text-sm font-medium tracking-wide text-[#795b37]">{story.label}</p>
        <h2 id="sale-story-title" className="font-serif text-4xl leading-tight md:text-5xl">{story.title}</h2>
        <div className="mt-8 grid items-start gap-8 text-base leading-8 text-[#53635c] lg:grid-cols-[.95fr_1.05fr] lg:gap-x-12 xl:gap-x-16">
          <div className="space-y-5">
            {story.paragraphs.slice(0, 2).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <img src={kitchen} alt={story.imageAlt} loading="lazy" decoding="async" width={1745} height={1309} className="-order-1 block h-auto w-full lg:order-none" />
          {story.paragraphs.slice(2).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

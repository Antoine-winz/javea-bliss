import type { SaleLanguage } from '@shared/sale-content';
import { saleStory } from '@shared/sale-story';
import dining from '@assets/javea-bliss-dining-living-room.jpeg';

export default function SaleStory({ language }: { language: SaleLanguage }) {
  const story = saleStory[language];
  return (
    <section id="our-story" aria-labelledby="sale-story-title" className="border-t border-[#c9c2b6] bg-[#f4f0e8] px-6 py-16 text-[#24352f] md:px-12 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
        <div>
          <p className="mb-5 text-sm font-medium tracking-wide text-[#795b37]">{story.label}</p>
          <h2 id="sale-story-title" className="font-serif text-4xl leading-tight md:text-5xl">{story.title}</h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-[#53635c]">
            {story.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <img src={dining} alt={story.imageAlt} loading="lazy" decoding="async" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
      </div>
    </section>
  );
}

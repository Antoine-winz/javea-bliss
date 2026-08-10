import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import bandImage from "@assets/Bedroom2.3_1749116725138.jpeg";

/*
  Full-bleed photographic interlude between the amenity checklist and the neighbourhood
  section. The image drifts a few percent against the scroll — enough to feel alive,
  restrained enough not to read as an effect. Skipped entirely under reduced motion.
*/
const ImageBand = () => {
  const { t } = useLanguage();
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      // -1 when the band enters at the bottom, +1 as it leaves at the top.
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      img.style.transform = `translateY(${(-progress * 5).toFixed(2)}%) scale(1.12)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={frameRef}
      className="relative overflow-hidden h-[52vh] md:h-[64vh]"
      aria-label={t('band.caption')}
    >
      <img
        ref={imgRef}
        src={bandImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: "scale(1.12)" }}
        loading="lazy"
        width={2000}
        height={1500}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, hsl(213 38% 8% / 0.55) 0%, hsl(213 38% 8% / 0.12) 45%, transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-16 px-6 md:px-10">
        <div className="shell">
          <p data-reveal className="font-display text-bone text-3xl md:text-5xl font-light">
            {t('band.caption')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageBand;

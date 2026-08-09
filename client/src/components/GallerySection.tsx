import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import LazyImage from "@/components/LazyImage";

import bathroom1 from "@assets/Bathroom1_optimized.jpeg";
import bedroom1 from "@assets/Bedroom1_optimized.jpeg";
import bedroom12 from "@assets/Bedroom1.2_1749116725138.jpeg";
import bedroom2 from "@assets/Bedroom2_optimized.jpeg";
import bedroom23 from "@assets/Bedroom2.3_1749116725138.jpeg";
import bedroom24 from "@assets/Bedroom2.4_1749116725138.jpeg";
import entrance from "@assets/Entrance_1749116725138.jpeg";
import hall from "@assets/Hall_1749116725138.jpeg";
import kitchen1 from "@assets/Kitchen1_optimized.jpeg";
import kitchen12 from "@assets/Kitchen1.2_1749116725138.jpeg";
import kitchen13 from "@assets/Kitchen1.3_1749116725138.jpeg";
import livingroom1 from "@assets/Livingroom1_optimized.jpeg";
import livingroom11 from "@assets/Livingroom1.1_1749116725138.jpeg";
import livingroom12 from "@assets/Livingroom1.2_1749116725138.jpeg";
import terrace12 from "@assets/Terasse1.2_1749116725138.jpeg";
import terrace13 from "@assets/Terasse1.3_1749116725138.jpeg";
import terrace14 from "@assets/Terasse1.4_1749116725138.jpeg";
import tv1 from "@assets/TV1_1749116725138.jpeg";

// Shown before the grid is expanded. Ordered as an edit rather than by room, so the
// first screen is the terrace and living space rather than a bathroom.
const INITIAL_COUNT = 7;

const GallerySection = () => {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const images = [
    { src: livingroom11, alt: t('gallery.livingRoom2'), group: t('gallery.livingAreas') },
    { src: livingroom1, alt: t('gallery.livingRoom1'), group: t('gallery.livingAreas') },
    { src: kitchen1, alt: t('gallery.modernKitchen'), group: t('gallery.kitchen') },
    { src: bedroom1, alt: t('gallery.masterBedroom'), group: t('gallery.bedrooms') },
    { src: terrace13, alt: t('gallery.terrace2'), group: t('gallery.outdoor') },
    { src: bathroom1, alt: t('gallery.modernBathroom'), group: t('gallery.bathroom') },
    { src: bedroom2, alt: t('gallery.secondBedroom'), group: t('gallery.bedrooms') },
    { src: kitchen12, alt: t('gallery.kitchenDining'), group: t('gallery.kitchen') },
    { src: terrace12, alt: t('gallery.terrace1'), group: t('gallery.outdoor') },
    { src: livingroom12, alt: t('gallery.livingRoom3'), group: t('gallery.livingAreas') },
    { src: terrace14, alt: t('gallery.terrace3'), group: t('gallery.outdoor') },
    { src: bedroom12, alt: t('gallery.bedroom2'), group: t('gallery.bedrooms') },
    { src: kitchen13, alt: t('gallery.kitchenAppliances'), group: t('gallery.kitchen') },
    { src: tv1, alt: t('gallery.entertainment'), group: t('gallery.livingAreas') },
    { src: bedroom23, alt: t('gallery.bedroom4'), group: t('gallery.bedrooms') },
    { src: bedroom24, alt: t('gallery.bedroom5'), group: t('gallery.bedrooms') },
    { src: entrance, alt: t('gallery.apartmentEntrance'), group: t('gallery.entrance') },
    { src: hall, alt: t('gallery.hallway'), group: t('gallery.entrance') },
  ];

  const [lead, ...rest] = images;
  const visible = expanded ? rest : rest.slice(0, INITIAL_COUNT - 1);
  const hiddenCount = rest.length - visible.length;

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setDialogOpen(true);
  };

  const step = (delta: number) =>
    setCurrentImageIndex((i) => (i + delta + images.length) % images.length);

  return (
    <section id="gallery" className="section bg-bone">
      <div className="shell">
        <div className="grid lg:grid-cols-12 gap-y-8 gap-x-16 mb-12 md:mb-16">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-5">{t('gallery.eyebrow')}</p>
            <h2 className="display-lg">{t('gallery.title')}</h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="lede">{t('gallery.description')}</p>
          </div>
        </div>

        {/* Lead image, full width. */}
        <button
          onClick={() => openImageModal(0)}
          className="group block w-full ratio-wide overflow-hidden mb-4 md:mb-6"
          aria-label={lead.alt}
        >
          <LazyImage
            src={lead.src}
            alt={lead.alt}
            className="img-cover img-zoom"
            width={1600}
            height={900}
          />
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {visible.map((image, i) => (
            <button
              key={image.src}
              onClick={() => openImageModal(i + 1)}
              className="group block ratio-portrait overflow-hidden"
              aria-label={image.alt}
            >
              <LazyImage
                src={image.src}
                alt={image.alt}
                className="img-cover img-zoom"
                width={800}
                height={1000}
              />
            </button>
          ))}
        </div>

        {hiddenCount > 0 && (
          <div className="mt-12 text-center">
            <button onClick={() => setExpanded(true)} className="btn-outline">
              {t('gallery.showAll')} ({images.length})
            </button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[100vw] w-screen h-screen sm:max-w-[100vw] p-0 border-0 bg-ink/97 rounded-none">
          <div className="relative h-full w-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-5">
              <p className="font-sans text-[0.75rem] tracking-[0.15em] uppercase text-bone/60">
                {images[currentImageIndex].group}
                <span className="mx-3 text-bone/25">·</span>
                {currentImageIndex + 1} / {images.length}
              </p>
              <button
                onClick={() => setDialogOpen(false)}
                className="text-bone/60 hover:text-bone transition p-2 -mr-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 md:px-16 pb-6 min-h-0">
              <img
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].alt}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <button
              onClick={() => step(-1)}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone transition p-3"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={() => step(1)}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-bone/50 hover:text-bone transition p-3"
              aria-label="Next photograph"
            >
              <ChevronRight className="h-7 w-7" />
            </button>

            <p className="pb-6 px-6 text-center font-sans text-[0.8125rem] text-bone/55">
              {images[currentImageIndex].alt}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;

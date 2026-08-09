import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

interface GalleryImage {
  src: string;
  alt: string;
}

interface GalleryCategory {
  title: string;
  images: GalleryImage[];
}

const GallerySection = () => {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  const galleryCategories = [
    {
      title: t('gallery.livingAreas'),
      images: [
        { src: livingroom1, alt: t('gallery.livingRoom1') },
        { src: livingroom11, alt: t('gallery.livingRoom2') },
        { src: livingroom12, alt: t('gallery.livingRoom3') },
        { src: tv1, alt: t('gallery.entertainment') }
      ]
    },
    {
      title: t('gallery.kitchen'),
      images: [
        { src: kitchen1, alt: t('gallery.modernKitchen') },
        { src: kitchen12, alt: t('gallery.kitchenDining') },
        { src: kitchen13, alt: t('gallery.kitchenAppliances') }
      ]
    },
    {
      title: t('gallery.bedrooms'),
      images: [
        { src: bedroom1, alt: t('gallery.masterBedroom') },
        { src: bedroom12, alt: t('gallery.bedroom2') },
        { src: bedroom2, alt: t('gallery.secondBedroom') },
        { src: bedroom23, alt: t('gallery.bedroom4') },
        { src: bedroom24, alt: t('gallery.bedroom5') }
      ]
    },
    {
      title: t('gallery.bathroom'),
      images: [
        { src: bathroom1, alt: t('gallery.modernBathroom') }
      ]
    },
    {
      title: t('gallery.outdoor'),
      images: [
        { src: terrace12, alt: t('gallery.terrace1') },
        { src: terrace13, alt: t('gallery.terrace2') },
        { src: terrace14, alt: t('gallery.terrace3') }
      ]
    },
    {
      title: t('gallery.entrance'),
      images: [
        { src: entrance, alt: t('gallery.apartmentEntrance') },
        { src: hall, alt: t('gallery.hallway') }
      ]
    }
  ];

  // Flatten all images for modal navigation
  const allImages = galleryCategories.flatMap(category => category.images);

  const openImageModal = (globalIndex: number) => {
    setCurrentImageIndex(globalIndex);
    setDialogOpen(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length);
  };

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % allImages.length);
  };

  return (
    <section id="gallery" className="pt-24 pb-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-2">{t('gallery.title')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-4"></div>
          <p className="max-w-3xl mx-auto text-gray-700">{t('gallery.description')}</p>
        </div>
        
        {galleryCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h3 className="font-montserrat font-semibold text-2xl text-primary mb-6 text-center">{category.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.images.map((image, imageIndex) => {
                const globalIndex = galleryCategories.slice(0, categoryIndex).reduce((acc, cat) => acc + cat.images.length, 0) + imageIndex;
                return (
                  <div 
                    key={imageIndex} 
                    onClick={() => openImageModal(globalIndex)}
                    className="cursor-pointer"
                  >
                    <LazyImage 
                      src={image.src} 
                      alt={image.alt} 
                      className="gallery-img rounded-lg shadow-md w-full"
                      loading="lazy"
                      width={400}
                      height={250}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0 bg-black bg-opacity-90">
          <div className="relative h-full flex items-center justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-white hover:bg-black/20"
              onClick={() => setDialogOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="max-w-full max-h-[80vh] p-4">
              <img 
                src={allImages[currentImageIndex].src} 
                alt={allImages[currentImageIndex].alt} 
                className="max-w-full max-h-[70vh] object-contain"
              />
              
              <div className="flex justify-between mt-4">
                <Button 
                  variant="ghost" 
                  onClick={prevImage} 
                  className="text-white hover:bg-black/20"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={nextImage} 
                  className="text-white hover:bg-black/20"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySection;

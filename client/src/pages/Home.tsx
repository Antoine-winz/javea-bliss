import Navigation from "@/components/Navigation";
import PromotionalHeader from "@/components/PromotionalHeader";
import HeroSection from "@/components/HeroSection";
import AtGlanceSection from "@/components/AtGlanceSection";
import GallerySection from "@/components/GallerySection";
import ApartmentSection from "@/components/ApartmentSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import ImageBand from "@/components/ImageBand";
import LocationSection from "@/components/LocationSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import HostNote from "@/components/HostNote";
import RatesSection from "@/components/RatesSection";
import LongTermRentalPromo from "@/components/LongTermRentalPromo";
import BookingSection from "@/components/BookingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

/*
  Order: photography sits directly under the hero and the essentials strip —
  photos are how a rental gets shortlisted. The long-stay offer appears once
  (the ink section before booking), not twice.
*/
const Home = () => {
  return (
    <div className="scroll-smooth">
      <Navigation />
      <PromotionalHeader />
      <HeroSection />
      <AtGlanceSection />
      <GallerySection />
      <ApartmentSection />
      <AmenitiesSection />
      <ImageBand />
      <LocationSection />
      <TestimonialsSection />
      <HostNote />
      <RatesSection />
      <LongTermRentalPromo />
      <BookingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;

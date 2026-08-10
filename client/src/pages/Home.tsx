import Navigation from "@/components/Navigation";
import PromotionalHeader from "@/components/PromotionalHeader";
import HeroSection from "@/components/HeroSection";
import TrendingSection from "@/components/TrendingSection";
import AtGlanceSection from "@/components/AtGlanceSection";
import ApartmentSection from "@/components/ApartmentSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import ImageBand from "@/components/ImageBand";
import LocationSection from "@/components/LocationSection";
import GallerySection from "@/components/GallerySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import RatesSection from "@/components/RatesSection";
import LongTermRentalPromo from "@/components/LongTermRentalPromo";
import BookingSection from "@/components/BookingSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="scroll-smooth">
      <Navigation />
      <PromotionalHeader />
      <HeroSection />
      <TrendingSection />
      <AtGlanceSection />
      <ApartmentSection />
      <AmenitiesSection />
      <ImageBand />
      <LocationSection />
      <GallerySection />
      <TestimonialsSection />
      <RatesSection />
      <LongTermRentalPromo />
      <BookingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;

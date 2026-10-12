import FloorPlan from "@/components/FloorPlan";
import Navigation from "@/components/Navigation";
import PromotionalHeader from "@/components/PromotionalHeader";
import HeroSection from "@/components/HeroSection";
import AtGlanceSection from "@/components/AtGlanceSection";
import GallerySection from "@/components/GallerySection";
import ApartmentSection from "@/components/ApartmentSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import ImageBand from "@/components/ImageBand";
import LocationSection from "@/components/LocationSection";
import DeferredSection from "@/components/DeferredSection";
import RatesSection from "@/components/RatesSection";
import LongTermRentalPromo from "@/components/LongTermRentalPromo";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import IdealistaListing from "@/components/IdealistaListing";

/*
  Order: photography sits directly under the hero and the essentials strip, photos are how a rental gets shortlisted. The long-stay offer appears once
  (the ink section before booking), not twice.
*/
const Home = () => {
  return (
    <div className="scroll-smooth">
      <Navigation />
      <PromotionalHeader />
      <HeroSection />
      <IdealistaListing />
      <AtGlanceSection />
      <GallerySection />
      <ApartmentSection />
      <FloorPlan />
      <AmenitiesSection />
      <ImageBand />
      <LocationSection />
      <DeferredSection kind="reviews" />
      <RatesSection />
      <LongTermRentalPromo />
      <DeferredSection kind="booking" />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Home;

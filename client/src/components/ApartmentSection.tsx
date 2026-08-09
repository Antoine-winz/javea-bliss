import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import apartmentImage from "@assets/IMG_2581_optimized.jpeg";

const ApartmentSection = () => {
  const { t, getLocalizedPath, language } = useLanguage();
  
  const interiorFeatures = [
    t('interior.bedrooms'),
    t('interior.bathroom'),
    t('interior.kitchen'),
    t('interior.lounge'),
    t('interior.lighting'),
    t('interior.patio'),
    t('interior.laundry'),
    t('interior.connectivity')
  ];

  const buildingFeatures = [
    t('building.security'),
    t('building.marina'),
    t('building.shopping')
  ];

  return (
    <section id="apartment" className="pt-24 pb-16 bg-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-2">{t('apartment.title')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-4"></div>
          <p className="max-w-3xl mx-auto text-gray-700">
            {t('apartment.description')}
          </p>
          {language === 'nl' && (
            <p className="max-w-3xl mx-auto text-gray-700 mt-4 bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <strong>Ideaal voor huiseigenaren:</strong> Zoekt u een comfortabele uitvalsbasis tijdens de renovatie van uw nieuwe huis in Javea? Wij bieden speciale lange-termijn tarieven.
            </p>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <img 
              src={apartmentImage} 
              alt="Interior of the apartment" 
              className="rounded-lg shadow-lg w-full h-auto object-cover"
              width="600"
              height="400"
              loading="lazy"
            />
          </div>
          
          <div className="md:w-1/2">
            <h3 className="font-montserrat font-semibold text-2xl text-primary mb-6">{t('interior.title')}</h3>
            
            <ul className="space-y-4">
              {interiorFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-1 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <h3 className="font-montserrat font-semibold text-2xl text-primary mt-8 mb-6">{t('building.title')}</h3>
            
            <ul className="space-y-4">
              {buildingFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-secondary mt-1 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Restaurant Proximity Feature */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="font-montserrat font-bold text-2xl text-primary mb-4 text-center">
            🚶‍♂️ {t('apartment.restaurantProximity') || 'Walk to the Best Restaurants'}
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            {t('apartment.restaurantProximityDesc') || 'Your apartment is perfectly located within walking distance of Jávea\'s most popular restaurants and bars.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">Chabada</div>
              <div className="text-sm text-gray-600">5 min walk</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">La Bambula</div>
              <div className="text-sm text-gray-600">6 min walk</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">Bohemians</div>
              <div className="text-sm text-gray-600">6 min walk</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-primary">La Fontana</div>
              <div className="text-sm text-gray-600">3 min walk</div>
            </div>
          </div>
          <div className="text-center mt-6">
            <a 
              href={getLocalizedPath('/recommendations')}
              className="inline-flex items-center bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
            >
              {t('apartment.viewAllRestaurants') || 'View Complete Restaurant Guide'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApartmentSection;

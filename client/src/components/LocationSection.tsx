import { 
  Umbrella, 
  Waves,
  Utensils,
  Building,
  Mountain
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LocationSection = () => {
  const { t, getLocalizedPath } = useLanguage();
  
  const locationHighlights = [
    {
      icon: <Umbrella className="h-8 w-8" />,
      title: t('paradise.beach.title'),
      description: t('paradise.beach.description')
    },
    {
      icon: <Waves className="h-8 w-8" />,
      title: t('paradise.watersports.title'),
      description: t('paradise.watersports.description')
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: t('paradise.dining.title'),
      description: t('paradise.dining.description')
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: t('paradise.oldtown.title'),
      description: t('paradise.oldtown.description')
    },
    {
      icon: <Mountain className="h-8 w-8" />,
      title: t('paradise.walks.title'),
      description: t('paradise.walks.description')
    }
  ];

  return (
    <section id="location" className="pt-24 pb-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-2">{t('paradise.title')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-4"></div>
          <p className="max-w-4xl mx-auto mb-6">
            {t('paradise.description1')}
          </p>
          <p className="max-w-4xl mx-auto">
            {t('paradise.description2')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {locationHighlights.map((highlight, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="text-secondary text-4xl mt-1 flex-shrink-0">
                  {highlight.icon}
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-xl mb-2">{highlight.title}</h3>
                  <p>{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              title="Map of Jávea"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3129.5518892816513!2d0.16624431562674738!3d38.33683497966254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x129e1ca7dbc50a9d%3A0xb3f7be0b200e9b12!2sPlaya%20del%20Arenal!5e0!3m2!1sen!2ses!4v1624513266629!5m2!1sen!2ses"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
        
        {/* Restaurant Recommendations Link */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-4">
              🍽️ {t('location.restaurantTitle') || 'Local Restaurant Recommendations'}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('location.restaurantDesc') || 'Discover the best restaurants and bars within walking distance, including Chabada, La Bambula, Masena, and Bohemians. Our curated list features authentic local dining experiences.'}
            </p>
            <a 
              href={getLocalizedPath('/recommendations')}
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {t('location.viewRecommendations') || 'View Restaurant Guide'}
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

export default LocationSection;

import { Bed, MapPin, Snowflake, Car } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const AtGlanceSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Bed className="h-10 w-10 text-secondary mb-4" />,
      title: t('glance.sleeps'),
      description: t('glance.bedrooms')
    },
    {
      icon: <MapPin className="h-10 w-10 text-secondary mb-4" />,
      title: t('glance.beach'),
      description: t('glance.bathroom')
    },
    {
      icon: <Snowflake className="h-10 w-10 text-secondary mb-4" />,
      title: t('glance.ac'),
      description: t('glance.wifi')
    },
    {
      icon: <Car className="h-10 w-10 text-secondary mb-4" />,
      title: t('glance.parking'),
      description: t('glance.terrace')
    }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#faf7f2' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-2">{t('glance.title')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-muted p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
              <div className="flex justify-center">
                {feature.icon}
              </div>
              <h3 className="font-montserrat font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AtGlanceSection;

import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const RatesSection = () => {
  const { t } = useLanguage();
  
  const rates = [
    {
      season: t('rates.highSeason'),
      period: t('rates.highPeriod'),
      rate: t('rates.highRate'),
      color: "bg-accent"
    },
    {
      season: t('rates.midSeason'), 
      period: t('rates.midPeriod'),
      rate: t('rates.midRate'),
      color: "bg-secondary"
    },
    {
      season: t('rates.lowSeason'),
      period: t('rates.lowPeriod'),
      rate: t('rates.lowRate'), 
      color: "bg-primary"
    }
  ];

  const policies = [
    t('rates.policy1'),
    t('rates.policy2'),
    t('rates.policy3'),
    t('rates.policy4')
  ];

  return (
    <section id="rates" className="pt-24 pb-16" style={{ backgroundColor: '#faf7f2' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-2">{t('rates.title')}</h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-4"></div>
          <p className="max-w-3xl mx-auto text-gray-700">
            {t('rates.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {rates.map((rate, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`${rate.color} text-white p-4 text-center`}>
                <h3 className="font-montserrat font-bold text-xl">{rate.season}</h3>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-3">{rate.period}</p>
                <p className="font-montserrat font-bold text-2xl text-primary">{rate.rate}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="font-montserrat font-bold text-2xl text-primary mb-6 text-center">{t('rates.policies')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {policies.map((policy, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0" />
                <span className="text-gray-700">{policy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RatesSection;
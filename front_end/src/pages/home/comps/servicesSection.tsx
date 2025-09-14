import React from 'react';
import { Truck, CreditCard, Shield, Headphones,UserStar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ServiceItem {
  id: number;
  translationKey: string;
  icon: React.ReactNode;
}

const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  const services: ServiceItem[] = [
     {
      id: 5,
      translationKey: "service5",
      icon: <UserStar className="w-8 h-8 text-purple-600" />
    },
    {
      id: 1,
      translationKey: "service1",
      icon: <CreditCard className="w-8 h-8 text-blue-600" />
    },
   
    {
      id: 2,
      translationKey: "service2",
      icon: <Truck className="w-8 h-8 text-green-600" />
    },
    {
      id: 3,
      translationKey: "service3",
      icon: <Shield className="w-8 h-8 text-purple-600" />
    },
    
    {
      id: 4,
      translationKey: "service4",
      icon: <Headphones className="w-8 h-8 text-orange-600" />
    }
  ];

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('services.sectionTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('services.sectionDescription')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {services.map((service: ServiceItem) => (
            <div
              key={service.id}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center group hover:scale-105"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="bg-gray-100 rounded-full p-4 group-hover:bg-gray-200 transition-colors duration-300">
                  {service.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {t(`services.${service.translationKey}.title`)}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {t(`services.${service.translationKey}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA (Optional) */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            {t('services.bottomText')}
          </p>
          <Link to="/Collections" className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg">
            {t('services.ctaButton')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Users, Award, Heart } from 'lucide-react';
import profile from "../../../assets/profile/man-portrait-posing-loft-modern-space.jpg"
const OurStorySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('ourStory.title')}
          </h2>
          <div className="w-20 h-1 bg-gray-900 mx-auto mb-6"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story Content */}
          <div className="space-y-6">
            {/* Main Story Text */}
            <div className="prose prose-lg text-gray-600 dark:text-gray-300">
              <p className="text-lg leading-relaxed">
                {t('ourStory.mainText')}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-2">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('ourStory.location.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('ourStory.location.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-full p-2">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('ourStory.team.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('ourStory.team.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-full p-2">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('ourStory.expertise.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('ourStory.expertise.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-full p-2">
                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {t('ourStory.mission.title')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t('ourStory.mission.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
  <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
    {/* Artisan profile section */}
    <div className="text-center">
      <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm overflow-hidden">
        {/* Remove the Users icon since you're using a profile image */}
        <img className='w-full h-full rounded-full object-cover' src={profile} alt="Mohamed Borrached" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{t('ourStory.ownerName')}</h3>
      <p className="text-sm text-gray-600">{t('ourStory.artisanTitle')}</p>
    </div>
  </div>
</div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full opacity-50 animate-pulse delay-300"></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OurStorySection;
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import image1 from "@/assets/ZelijeHome/images20.jpg";
import image2 from "@/assets/ZelijeHome/image27.jpg";
import image3 from "@/assets/ZelijeHome/image23.jpg";
interface Slide {
  id: number;
  translationKey: string;
  image: string;
}

const HomePageSlider: React.FC = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides: Slide[] = [
    {
      id: 1,
      translationKey: "slide1",
      image: image1 as string 
    },
    {
      id: 2,
      translationKey: "slide2",
      image: image2 as string 
    },
    {
      id: 3,
      translationKey: "slide3",
      image: image3 as string
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  const nextSlide = (): void => {
    setCurrentSlide((prev: number) => (prev + 1) % slides.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev: number) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide: Slide, index: number) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100'
                : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Dark Overlay */}
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
              <div className="text-center text-white max-w-4xl mx-auto">
                {/* Main Title */}
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transform transition-all duration-1000 ${
                  index === currentSlide 
                    ? 'translate-y-0 opacity-100 delay-500' 
                    : 'translate-y-8 opacity-0'
                }`}>
                  {t(`slider.${slide.translationKey}.title`)}
                </h1>

                {/* Subtitle */}
                <p className={`text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed transform transition-all duration-1000 ${
                  index === currentSlide 
                    ? 'translate-y-0 opacity-100 delay-700' 
                    : 'translate-y-8 opacity-0'
                }`}>
                  {t(`slider.${slide.translationKey}.subtitle`)}
                </p>

                {/* Call to Action Button */}
                <div className={`transform transition-all duration-1000 ${
                  index === currentSlide 
                    ? 'translate-y-0 opacity-100 delay-1000' 
                    : 'translate-y-8 opacity-0'
                }`}>
                  <Button 
                    size="lg" 
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full transform hover:scale-105 transition-transform duration-300 shadow-lg"
                    onClick={() => {
                      // Add your navigation logic here
                    }}
                  >
                    {t(`slider.${slide.translationKey}.buttonText`)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 rounded-full p-3 text-white hover:text-white"
        aria-label={t('slider.prevSlide')}
      >
        <svg className="w-6 h-6 hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-white hover:bg-opacity-30 rounded-full p-3 text-white hover:text-white"
        aria-label={t('slider.nextSlide')}
      >
        <svg className="w-6 h-6 hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {slides.map((_: Slide, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-75'
              }`}
              aria-label={t('slider.goToSlide', { number: index + 1 })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePageSlider;
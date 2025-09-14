import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Star,
  Package,
} from "lucide-react";
import { useGetServicesQuery } from "@/services/service/serviceApi";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import { addService } from "@/redux/slices/serviceSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Constants
const AUTO_SLIDE_INTERVAL = 6000;
const DEFAULT_RATING = 5;

const ImageSlider = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(nextImage, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  const translateDirection = isRTL
    ? "translateX(" + currentIndex * 100 + "%)"
    : `translateX(-${currentIndex * 100}%)`;

  return (
    <div className="relative overflow-hidden group">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: translateDirection }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative w-full flex-shrink-0">
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className="w-full h-104 object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={isRTL ? nextImage : prevImage}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>

          <button
            onClick={isRTL ? prevImage : nextImage}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-md flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-6"
                    : "bg-white/60 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ServiceCard = ({ service }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const dispatch = useDispatch();

  const handleContactClick = () => {
    dispatch(addService(service));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-MA").format(price);
  };

  return (
    <div className="group hover:shadow-xl transition-all duration-500 border-0 bg-white overflow-hidden rounded-lg shadow-sm h-full flex flex-col">
      <div className="relative">
        <ImageSlider
          images={service.image}
          alt={service.name[currentLang] || service.name.en}
        />

        <div className="absolute top-4 right-4">
          <div className="bg-white text-gray-800 font-medium inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
            <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
            {DEFAULT_RATING}
          </div>
        </div>
      </div>

      <div className="p-6 pb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
          {service.name[currentLang] || service.name.en}
        </h3>
      </div>

      <div className="px-6 pt-0 flex-1 flex flex-col">
        <p
          className="text-gray-600 text-base leading-relaxed mb-6 flex-1 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {service.description[currentLang] || service.description.en}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {t("service.price")} :
            </p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(service.lowPrice)} - {formatPrice(service.highPrice)}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {" "}
                {t("sheet.currency")}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <Link to={"/service/confirm"}>
          <Button
            onClick={handleContactClick}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 transition-all duration-300 group rounded-md inline-flex items-center justify-center"
          >
            Get a Quote
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, title, content }) => (
  <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600">{content}</p>
  </div>
);

const OurServices = () => {
  const { data, isLoading, isError,refetch } = useGetServicesQuery();
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
    if (isError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Services
            </h3>
            <p className="text-gray-500 mb-4">
              Unable to fetch order data. Please try again.
            </p>
            <Button
              onClick={() => refetch()}
              className="bg-gray-950 hover:bg-gray-800"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }
  
  return (
    <>
    
      <section className="bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              {t("service.title1")}
              <span className="block text-black">{t("service.title2")}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t("service.text")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {data?.services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
            
          </div>
{data?.services?.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h.01M15 9h.01M9 15h.01M15 15h.01"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Service Available
            </h2>
            <p className="text-gray-600 text-lg">
              Our Service is being updated. Check back soon for new arrivals!
            </p>
          </div>
        )}
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {t("service.titleCard")}
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t("service.textCard")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ContactCard
                icon={<Phone className="w-6 h-6 text-white" />}
                title={t("service.call")}
                content={<span dir="ltr">+212 6 0900-6229</span>}
              />
              <ContactCard
                icon={<Mail className="w-6 h-6 text-white" />}
                title={t("service.email")}
                content="zellij.capital@gmail.com"
              />
              <ContactCard
                icon={<MapPin className="w-6 h-6 text-white" />}
                title={t("service.visit")}
                content={t("service.address")}
              />
            </div>

            <div className="text-center mt-8">
              <Link
                to="/contact"
                dir="ltr"
                className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-md inline-flex items-center justify-center font-medium transition-colors"
              >
                {t("service.schedule")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurServices;

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetProductsQuery } from "@/services/products/productApi";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";

const ProductCard = ({ product }: { product: any }) => {
  const { t, i18n } = useTranslation();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dispatch=useDispatch(); 
  const currentLanguage = localStorage?.getItem("language");
  const selectedColor = product.details?.[selectedColorIndex];

  if (!product.details || product.details.length === 0) {
    return null;
  }
  
  const handleAddToCart = () => {    
    dispatch(addToCart({
      name:product.name,
      productId: product._id,
      detailId: selectedColor?._id,
      colorName: selectedColor?.colorName,
      price: product.price,
      size: product.size,
      colorCode: selectedColor?.colorCode,
      quantity: 1,
      picture:selectedColor.picture
    }))
  };

  const isInStock = (selectedColor?.quantity || 0) > 0;

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {/* Image */}
        <img
          src={selectedColor?.picture}
          alt={product.name?.[currentLanguage] || "Product"}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Image Loading Placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Stock Badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all duration-300 ${
              isInStock
                ? "bg-emerald-500/90 text-white border-emerald-400/50 shadow-lg shadow-emerald-500/25"
                : "bg-red-500/90 text-white border-red-400/50 shadow-lg shadow-red-500/25"
            }`}
          >
            {isInStock ? ` ${t("collections.inStock")}` : `${t("collections.outOfStock")}`}
          </div>
        </div>

        {/* Quick Add Button - Shows on Hover */}
        <div
          className={`absolute inset-x-4 bottom-4 transition-all duration-500 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 backdrop-blur-md border ${
              isInStock
                ? "bg-white/95 text-gray-900 border-white/50 hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/10"
                : "bg-gray-400/80 text-gray-600 border-gray-400/50 cursor-not-allowed"
            }`}
          >
            {isInStock ? ` ${t("collections.quickAdd")}` : `${t("collections.outOfStock")}`}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-4">
        {/* Product Name */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 group-hover:text-gray-700 transition-colors duration-300">
            {product.name?.[currentLanguage] || "Product"}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {t("contact.form.size")} : {product.size}
          </p>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">{t("collections.Color")} </span>
            <span className="text-sm text-gray-500 capitalize">
              {selectedColor?.colorName?.[currentLanguage]}
            </span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {product.details?.map((detail, index) => (
              <button
                key={detail._id}
                onClick={() => setSelectedColorIndex(index)}
                className={`relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 ${
                  selectedColorIndex === index
                    ? "ring-2 ring-gray-900 ring-offset-2 scale-110"
                    : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                }`}
                style={{ backgroundColor: detail.colorCode }}
                title={detail.colorName?.[currentLanguage]}
              >
                {selectedColorIndex === index && (
                  <div className="absolute inset-0 rounded-full border-2 border-white shadow-inner"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price and Add to Cart */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {product.price}
              </span>
              <span className="text-lg font-semibold text-gray-600 ml-1">
                DH
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                isInStock
                  ? "bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/25"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m4.5-5a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {t("collections.add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Products Grid Component
const ProductsGrid = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-1/3 mb-3"></div>
            <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-1/2"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="aspect-[4/5] bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-4">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We couldn't load the products right now. Please check your
            connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
              <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            {t("collections.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
           {t("collections.text")}{" "}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data?.products?.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {data?.products?.length === 0 && (
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
              No Products Available
            </h2>
            <p className="text-gray-600 text-lg">
              Our collection is being updated. Check back soon for new arrivals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { ProductCard, ProductsGrid };
export default ProductsGrid;

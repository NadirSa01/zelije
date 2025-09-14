import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  removeFromCart,
  updateQuantitySlice,
  type CartItem,
} from "@/redux/slices/cartSlice";
import type { RootState } from "@/redux/store/store";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const itemsFromSlice = useSelector((state: RootState) => state.cart.items);
  const [cartProducts, setCartProducts] = useState<CartItem[]>(itemsFromSlice);
  const { t } = useTranslation();
  const language = localStorage?.getItem("language") || "";

  // Load cart products from localStorage and Redux
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const storedCart = localStorage?.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCartProducts(parsedCart);
        } else {
          setCartProducts(itemsFromSlice);
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCartProducts(itemsFromSlice);
      }
    };

    loadCartFromStorage();
  }, [itemsFromSlice]);

  // Get localized text helper function
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return "";
    return textObj[language] || textObj.en || "";
  };

  // Update quantity function
  const updateQuantity = (detailId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantitySlice([detailId, newQuantity]));
    }
  };

  // Remove product function
  const removeProduct = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  // Calculate totals
  const subtotal = cartProducts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  const totalItems = cartProducts.length;

  const total = subtotal;

  const handleProceedToCheckout = () => {
    // Add your checkout logic here
    console.log("Proceeding to checkout with items:", cartProducts);
  };

  // Empty cart state
  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("sheet.emptyCart")}
            </h2>
            <p className="text-gray-600 mb-8">{t("sheet.startShopping")}</p>
            <Link to="/Collections">
              <Button className="bg-gray-950 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                <ArrowLeft className="w-5 h-5 mr-2" />
                {t("sheet.buttonOne")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/Collections"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("sheet.buttonOne")}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("sheet.shoppingCart")}
          </h1>
       
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t("sheet.shoppingCart")} ({totalItems} {t("sheet.items")})
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartProducts.map((product: CartItem) => (
                  <div
                    key={product.detailId}
                    className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    {/* Mobile Layout */}
                    <div className="block sm:hidden">
                      <div className="flex gap-3 mb-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                            {product.picture ? (
                              <img
                                src={product.picture}
                                alt={getLocalizedText(product.name)}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-2">
                            {getLocalizedText(product.name)}
                          </h3>
                          <div className="text-lg font-bold text-gray-900 mb-2">
                            {product.price} {t("sheet.currency")}
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg flex-shrink-0"
                          onClick={() => removeProduct(product.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            {t("sheet.Size")}: {product.size}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>
                            Color: {getLocalizedText(product.colorName)}
                          </span>
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: product.colorCode }}
                          />
                        </div>
                      </div>

                      {/* Mobile Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-gray-200 rounded-l-lg"
                            onClick={() =>
                              updateQuantity(
                                product.detailId,
                                product.quantity - 1
                              )
                            }
                            disabled={product.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-3 py-2 font-medium min-w-[2.5rem] text-center">
                            {product.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-gray-200 rounded-r-lg"
                            onClick={() =>
                              updateQuantity(
                                product.detailId,
                                product.quantity + 1
                              )
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Item Total Mobile */}
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {t("sheet.Subtotal")}
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {(product.price * product.quantity).toFixed(2)}{" "}
                            {t("sheet.currency")}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                            {product.picture ? (
                              <img
                                src={product.picture}
                                alt={getLocalizedText(product.name)}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {getLocalizedText(product.name)}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span>
                              {t("sheet.Size")}: {product.size}
                            </span>
                            <div className="flex items-center gap-2">
                              <span>
                                {t("collections.Color")} : {getLocalizedText(product.colorName)}
                              </span>
                              <div
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: product.colorCode }}
                              />
                            </div>
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {product.price} {t("sheet.currency")}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-xl">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 hover:bg-gray-200 rounded-l-xl"
                              onClick={() =>
                                updateQuantity(
                                  product.detailId,
                                  product.quantity - 1
                                )
                              }
                              disabled={product.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {product.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 hover:bg-gray-200 rounded-r-xl"
                              onClick={() =>
                                updateQuantity(
                                  product.detailId,
                                  product.quantity + 1
                                )
                              }
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                            onClick={() => removeProduct(product.productId)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total Desktop */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-600">
                          {t("sheet.Subtotal")}:
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                          {(product.price * product.quantity).toFixed(2)}{" "}
                          {t("sheet.currency")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t("sheet.OrderSummary")}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {t("sheet.Subtotal")} ({totalItems} {t("sheet.items")})
                  </span>
                  <span>
                    {subtotal.toFixed(2)} {t("sheet.currency")}
                  </span>
                </div>

             
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900"> {t("sheet.Total")}</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {total.toFixed(2)} {t("sheet.currency")}
                  </span>
                </div>
              </div>
              <Link to="/checkout">
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gray-950 hover:bg-gray-800 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {t("sheet.Checkout")} • {total.toFixed(2)}{" "}
                  {t("sheet.currency")}
                </Button>
              </Link>

              <div className="mt-6 space-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t("sheet.advantage1")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{t("sheet.advantage2")}</span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

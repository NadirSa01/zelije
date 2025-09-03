import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  closeSheet,
  removeFromCart,
  updateQuantitySlice,
  setCartItems, // You might need to add this action to your slice
  type CartItem,
} from "@/redux/slices/cartSlice";
import type { RootState } from "@/redux/store/store";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function SheetCart() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.cart.openSheet);
  const cartProducts = useSelector((state: RootState) => state.cart.items); // Use Redux state directly
  const { t } = useTranslation();
  const language = localStorage?.getItem("language") || "";

  // Load cart products from localStorage and sync with Redux
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const storedCart = localStorage?.getItem("cart");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          // Dispatch action to sync localStorage with Redux state
          dispatch(setCartItems(parsedCart)); // You'll need to implement this action
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    };

    if (isOpen) {
      loadCartFromStorage();
    }
  }, [isOpen, dispatch]);

  // Sync Redux state with localStorage whenever cartProducts changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartProducts));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartProducts]);

  // Get localized text helper function
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return "";
    return textObj[language] || textObj.en || "";
  };

  // Update quantity function
  const updateQuantity = (detailId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantitySlice([detailId, newQuantity]));
    }
  };

  // Remove product function
  const removeProduct = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  // Calculate totals
  const totalPrice = cartProducts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  const totalItems = cartProducts.reduce(
    (total, product) => total + product.quantity,
    0
  );

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => {
        dispatch(closeSheet());
      }}
    >
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-6 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl font-semibold">
                  {t("sheet.shoppingCart")}
                </SheetTitle>
                <p className="text-sm text-gray-500">
                  {totalItems} {t("sheet.items")}
                </p>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cartProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("sheet.emptyCart")}
              </h3>
              <p className="text-gray-500 text-sm">
                {t("sheet.startShopping")}
              </p>
            </div>
          ) : (
            <div className="px-6 py-4 space-y-4">
              {cartProducts.map((product: CartItem) => (
                <div
                  key={product.detailId}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
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
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate mb-1">
                        {getLocalizedText(product.name)}
                      </h3>

                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div
                            className="w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
                            style={{ backgroundColor: product.colorCode }}
                          />
                          <span className="truncate">
                            {getLocalizedText(product.colorName)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {t("sheet.Size")}: {product.size}
                        </p>
                      </div>

                      {/* Price and Controls */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold text-gray-900">
                          {product.price} {t("sheet.currency")}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-50 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-200"
                              onClick={() =>
                                updateQuantity(
                                  product.detailId,
                                  product.quantity - 1
                                )
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {product.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-gray-200"
                              onClick={() =>
                                updateQuantity(
                                  product.detailId,
                                  product.quantity + 1
                                )
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => removeProduct(product.productId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      {product.quantity > 1 && (
                        <div className="mt-2 text-right">
                          <span className="text-sm text-gray-500">
                            {t("sheet.Subtotal")}:{" "}
                            <span className="font-medium text-gray-900">
                              {(product.price * product.quantity).toFixed(2)}{" "}
                              {t("sheet.currency")}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartProducts.length > 0 && (
          <div className="border-t bg-white px-6 py-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                {totalPrice.toFixed(2)} {t("sheet.currency")}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/order">
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg"
                  onClick={() => {
                    dispatch(closeSheet());
                  }}
                >
                  {t("sheet.Checkout")} • {totalPrice.toFixed(2)}{" "}
                  {t("sheet.currency")}
                </Button>
              </Link>
              <div className="mt-1"></div>
              <SheetClose asChild>
                <Button variant="outline" className="w-full py-3 rounded-lg">
                  {t("sheet.buttonOne")}
                </Button>
              </SheetClose>
            </div>
          </div>
        )}

        {/* Empty Cart Footer */}
        {cartProducts.length === 0 && (
          <div className="px-6 py-6 border-t">
            <SheetClose asChild>
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg">
                Start Shopping
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default SheetCart;
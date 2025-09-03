import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { clearCart, type CartItem } from "@/redux/slices/cartSlice";
import { useTranslation } from "react-i18next";
import { clientSchema, type ClientSchema } from "./clientSchema";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddOrderMutation } from "@/services/orders/orderApi";
import type { OrderPyl } from "@/services/orders/orderPayload";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const [addOrder] = useAddOrderMutation();
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const itemsFromSlice = useSelector((state: RootState) => state.cart.items);
  const [cartProducts, setCartProducts] = useState<CartItem[]>(itemsFromSlice);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const dispatch = useDispatch();
  const navigate = useNavigate()
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

  const form = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: "",
      telephone: "",
      city: "",
      address: "",
    },
  });

  const subtotal = cartProducts.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
  const totalItems = cartProducts.length;
  const total = subtotal;

  const onSubmit = (data: ClientSchema) => {
    const orderPayload: OrderPyl[] = [];
    cartProducts.forEach((element) => {
      orderPayload.push({
        productId: element.productId,
        productDetailId: element.detailId,
        quantity: element.quantity,
      });
    });
    if (cartProducts.length >= 0 ) {
      addOrder({ data, orderPayload })
      .unwrap()
      .then(() => {
        toast.success("Order created with success")
        localStorage.setItem("cart","[]")
        setCartProducts([]);
        dispatch(clearCart())
        setTimeout(()=>{
          navigate("/collections")
        },1500)
      })
      .catch((err) => {
        toast.error(err)
      });
    }else{
      toast.error("No product selected")
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Toaster richColors position="top-right" />
      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <button
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              {showOrderSummary ? "Hide Order" : "Show Order"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              {total.toFixed(2)} DH
            </span>
            {showOrderSummary ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Order Summary Dropdown */}
      {showOrderSummary && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pb-4">
          <div className="space-y-3">
            {cartProducts.map((product) => (
              <div key={product.detailId} className="flex gap-3 py-2">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={product.picture}
                      alt={product.name.en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {product.name.en}
                  </h4>
                  <p className="text-xs text-gray-500">
                    Size: {product.size} • {product.colorName[lang]}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {product.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {(product.price * product.quantity).toFixed(2)} DH
                </div>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{subtotal.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between text-green-600 text-sm mt-1">
                <span>Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{total.toFixed(2)} DH</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200">
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                placeholder="Nadir Satori"
                                className="pl-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Telephone */}
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telephone *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type="tel"
                                placeholder="+212 6XX XXX XXX"
                                className="pl-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* City */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                placeholder="Enter your city"
                                className="pl-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                placeholder="Street address"
                                className="pl-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gray-950 hover:bg-gray-800 text-white py-6 text-lg font-semibold"
                    >
                      Place Order • {total.toFixed(2)} DH
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Desktop */}
          <div className="order-1 lg:order-2 hidden lg:block">
            <Card className="shadow-sm sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary ({totalItems} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartProducts.map((product) => (
                    <div
                      key={product.detailId}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={product.picture}
                            alt={product.name.en}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          {product.name.en}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <span>Size: {product.size}</span>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: product.colorCode }}
                            />
                            <span>{product.colorName[lang]}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            Qty: {product.quantity}
                          </span>
                          <span className="font-bold text-gray-900 text-sm">
                            {(product.price * product.quantity).toFixed(2)} DH
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} DH</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {total.toFixed(2)} DH
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;

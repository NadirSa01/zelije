import {  useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientSchema } from "../clientInfo/clientSchema";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";
import { Textarea } from "@/components/ui/textarea";
import { useCreateServiceOrderMutation } from "@/services/service/serviceApi";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const CheckoutFormService = () => {
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const language = i18n.language || "en";
  const service = useSelector((state: RootState) => state.service.service);
  const [createServiceOrder] = useCreateServiceOrderMutation();
  const navigate = useNavigate();
  const form = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: "",
      telephone: "",
      city: "",
      address: "",
      description: "",
    },
  });

  // Initialize selected price when service loads

  // Get localized content based on current language
  const getLocalizedContent = (content: {
    en: string;
    fr: string;
    ar: string;
  }) => {
    return content[language as keyof typeof content] || content.en;
  };

  const onSubmit = async (data: ClientSchema) => {
    if (data && service) {
      const serviceOrderPayload = {
        serviceId: service._id,
        clientData: {
          fullName: data.fullName,
          telephone: data.telephone,
          address: data.address,
          city: data.city,
        },
        description: data.description,
      };
      await createServiceOrder(serviceOrderPayload)
        .unwrap()
        .then(() => {
          setTimeout(() => {
            form.reset();
            navigate("/services");
          }, 1800);
          toast.success("Your order created with success");
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  // Handle case when service is not loaded
  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Service not found
          </h2>
          <p className="text-gray-600">Please select a service to continue.</p>
        </div>
      </div>
    );
  }

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
              {showOrderSummary ? "Hide Service" : "Show Service"}
            </span>
          </div>
          <div className="flex items-center gap-2">
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
            <div className="flex gap-3 py-2">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={service.image[0]}
                    alt={getLocalizedContent(service.name)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {getLocalizedContent(service.name)}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {getLocalizedContent(service.description)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Price range:</span>
                  <span className="text-xs font-medium text-gray-900">
                    {service.lowPrice} - {service.highPrice} DH
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between text-gray-900">
                <span> :</span>
                <span className="text-green-600">
                  {" "}
                  {service.lowPrice} - {service.highPrice} DH
                </span>
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
            {t("service.backButton")}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("service.checkOutTitle")}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="order-2 lg:order-1">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t("contact.form.title2")}
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
                          <FormLabel>{t("contact.form.fullName")} *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                placeholder={t(
                                  "contact.form.placeholders.name"
                                )}
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
                          <FormLabel>{t("contact.form.phone")} *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type="tel"
                                placeholder={t(
                                  "contact.form.placeholders.phone"
                                )}
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
                          <FormLabel>{t("contact.form.city")} </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                placeholder={t(
                                  "contact.form.placeholders.city"
                                )}
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
                          <FormLabel>{t("contact.form.address")} *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                placeholder={t(
                                  "contact.form.placeholders.address"
                                )}
                                className="pl-11"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("contact.form.description")}{" "}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "contact.form.placeholders.description"
                              )}
                              {...field}
                              className="resize-none overflow-y-auto"
                              onInput={(e) => {
                                const target = e.currentTarget;
                                target.style.height = "auto";
                                target.style.height = `${Math.min(
                                  target.scrollHeight,
                                  200
                                )}px`;
                              }}
                              style={{ maxHeight: "200px" }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gray-950 hover:bg-gray-800 text-white py-6 text-lg font-semibold"
                    >
                      {t("service.sendButton")}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Service Summary - Desktop */}
          <div className="order-1 lg:order-2 hidden lg:block">
            <Card className="shadow-sm sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t("service.panierName")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={service.image[0]}
                          alt={getLocalizedContent(service.name)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-base mb-2">
                        {getLocalizedContent(service.name)}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {getLocalizedContent(service.description)}
                      </p>
                    </div>
                  </div>

                  {/* Additional Images */}
                  {service.image && service.image.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {service.image.slice(1, 4).map((img, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`${getLocalizedContent(service.name)} ${
                              index + 2
                            }`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-900">
                    <span>{t("service.price")} :</span>
                    <span>
                      {" "}
                      {service.lowPrice} - {service.highPrice}{" "}
                      {t("sheet.currency")}
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

export default CheckoutFormService;

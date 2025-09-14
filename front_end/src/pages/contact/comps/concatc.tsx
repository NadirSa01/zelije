import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  User,
  MapPinHouse,
} from "lucide-react";
import { useCreateMessageMutation } from "@/services/messages/messageApi";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(2, "Address must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactSchema = z.infer<typeof contactSchema>;

interface ContactInfo {
  icon: React.ReactNode;
  translationKey: string;
}

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [createMessage] = useCreateMessageMutation();
  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Contact information
  const contactInfo: ContactInfo[] = [
    {
      icon: <Phone className="w-6 h-6" />,
      translationKey: "phone",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      translationKey: "email",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      translationKey: "address",
    },
    // {
    //   icon: <Clock className="w-6 h-6" />,
    //   translationKey: "hours",
    // },
  ];

  // Social media links
  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      url: "https://www.facebook.com/share/14FQBpFwjmT/",
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "#",
      color: "hover:text-pink-600",
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      url: "#",
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "#",
      color: "hover:text-blue-700",
    },
  ];

  const onSubmit = async (data: ContactSchema) => {
    if (data) {
      createMessage(data)
        .unwrap()
        .then(() => {
          toast.success("Message send with success");
          form.reset();
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  const message = encodeURIComponent(t("contact.whatsapp.message"));
  const phone = "212609006229";
  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-right" />

      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("contact.hero.title")}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t("contact.hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t("contact.form.title")}
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("contact.form.fullName")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  placeholder={t(
                                    "contact.form.placeholders.name"
                                  )}
                                  className="pl-11 py-3"
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
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("contact.form.address")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                                <Input
                                  type="text"
                                  placeholder={t(
                                    "contact.form.placeholders.address"
                                  )}
                                  className="pl-11 py-3"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone and Subject Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("contact.form.city")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPinHouse className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                                <Input
                                  type="text"
                                  placeholder={t(
                                    "contact.form.placeholders.city"
                                  )}
                                  className="pl-11 py-3"
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.phone")}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  type="tel"
                                  placeholder={t(
                                    "contact.form.placeholders.phone"
                                  )}
                                  className="pl-11  py-3"
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
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("contact.form.subject")}{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="py-3 w-full">
                                  <SelectValue
                                    placeholder={t(
                                      "contact.form.placeholders.subject"
                                    )}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="productInfo">
                                  {t("contact.form.subjects.productInfo")}
                                </SelectItem>
                                <SelectItem value="customOrder">
                                  {t("contact.form.subjects.customOrder")}
                                </SelectItem>
                                <SelectItem value="afterSale">
                                  {t("contact.form.subjects.afterSale")}
                                </SelectItem>
                                <SelectItem value="other">
                                  {t("contact.form.subjects.other")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("contact.form.message")}{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t(
                                "contact.form.placeholders.message"
                              )}
                              className="resize-none min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold transition-colors duration-200"
                    >
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t("contact.form.submitButton.idle")}
                      </>
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-8">
              {/* Contact Info Cards */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("contact.contactInfo.title")}
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-blue-100 rounded-full p-3 text-blue-600">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {t(
                            `contact.contactInfo.${info.translationKey}.title`
                          )}
                        </h4>
                        <div className="text-gray-600 text-sm space-y-1">
                          {(() => {
                            let items: string[] = [];
                            switch (info.translationKey) {
                              case "phone":
                                items = t("contact.contactInfo.phone.numbers", {
                                  returnObjects: true,
                                }) as string[];
                                break;
                              case "email":
                                items = t(
                                  "contact.contactInfo.email.addresses",
                                  { returnObjects: true }
                                ) as string[];
                                break;
                              case "address":
                                items = t("contact.contactInfo.address.lines", {
                                  returnObjects: true,
                                }) as string[];
                                break;
                              // case "hours":
                              //   items = t("contact.contactInfo.hours.times", {
                              //     returnObjects: true,
                              //   }) as string[];
                              //   break;
                            }
                            return items.map((item: string) => (
                              <p key={item} dir="ltr">
                                {item}
                              </p>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {t("contact.social.title")}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 ${social.color} transition-colors duration-200 hover:bg-gray-200`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.icon}
                      <span className="text-sm font-medium">
                        {t(`contact.social.${social.name.toLowerCase()}`)}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp Quick Contact */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">
                    {t("contact.whatsapp.title")}
                  </h3>
                </div>
                <p className="text-green-700 mb-4">
                  {t("contact.whatsapp.description")}
                </p>

                <a
                  href={`https://api.whatsapp.com/send?phone=${phone}&text=${message}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {t("contact.whatsapp.button")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

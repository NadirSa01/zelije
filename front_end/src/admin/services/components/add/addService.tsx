import ProdcutHeaders from "@/admin/products/components/modal/prodcutHeaders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Package, Plus, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { serviceSchema } from "./serviceSchema";
import type { ServiceSchema } from "./serviceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useUploadProductImageMutation } from "@/services/products/productApi";
import { useCreateServiceMutation } from "@/services/service/serviceApi";
import { error } from "console";

function AddService() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadImage] = useUploadProductImageMutation();
    const[createService]=useCreateServiceMutation(); 
  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nameEn: "",
      nameFr: "",
      nameAr: "",
      highPrice: "",
      lowPrice: "",
      picture: "",
      descriptionEn: "",
      descriptionFr: "",
      descriptionAr: "",
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to MinIO
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImage(formData).unwrap();

      console.log("MinIO URL received:", result.imageUrl);
      onChange(result.imageUrl);

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
      setImagePreview("");
    }
  };

  const removeImage = (onChange: (value: string) => void) => {
    onChange("");
    setImagePreview("");
  };

  const onSubmit = (data: ServiceSchema) => {
    const payload = {
      name: {
        en: data.nameEn,
        fr: data.nameFr,
        ar: data.nameAr,
      },
      description: {
        en: data.descriptionEn,
        fr: data.descriptionFr,
        ar: data.descriptionAr,
      },
      highPrice: data.highPrice,
      lowPrice: data.lowPrice,
      image: data.picture,
    };

    if ( payload ) {
        createService(payload).then(()=>{
            toast.success("Service created successfully");
            form.reset()
        }).catch((err)=>{
            toast.success(err.message);
        })
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <Toaster richColors position="top-right" />
        <ProdcutHeaders
          headerType={"Add New Service"}
          text={"Create a new service with image upload"}
           backLink={"/admin/services"}
          name={"Service   "}
        />
      </div>

      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-sm border-gray-200 mr-2 ml-2">
            <CardHeader className="p-2 m-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details of your service
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Service Names */}
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name (English)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter service name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nameFr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name (French)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter service name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name (Arabic)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter service name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Prices */}
                <FormField
                  control={form.control}
                  name="highPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>High Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter high price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lowPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Price</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter low price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Image */}
                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Image</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageChange(e, field.onChange)
                              }
                              className="hidden"
                              id="service-image-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() =>
                                document
                                  .getElementById("service-image-upload")
                                  ?.click()
                              }
                            >
                              <Upload className="w-4 h-4" />
                              Choose Image
                            </Button>
                            {field.value && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => removeImage(field.onChange)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          {(field.value || imagePreview) && (
                            <div className="mt-2">
                              <img
                                src={field.value || imagePreview}
                                alt="Service preview"
                                className="w-20 h-20 object-cover rounded-md border border-gray-300"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Descriptions */}
                <FormField
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description (English)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your English description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionFr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description (French)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your French description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your Arabic description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mr-2 ml-2 mb-10">
            <Button
              type="submit"
              className="bg-gray-950 hover:bg-gray-800 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddService;

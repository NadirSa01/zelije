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

function AddService() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadImage] = useUploadProductImageMutation();
  const [createService] = useCreateServiceMutation(); 
  
  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      nameEn: "",
      nameFr: "",
      nameAr: "",
      highPrice: "",
      lowPrice: "",
      picture: [], // This might need to be changed to an array depending on your schema
      descriptionEn: "",
      descriptionFr: "",
      descriptionAr: "",
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string | string[]) => void
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImageUrls: string[] = [];
    const newPreviews: string[] = [];

    try {
      // Process each selected file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);

        // Upload to MinIO
        const formData = new FormData();
        formData.append("image", file);
        const result = await uploadImage(formData).unwrap();
        
        console.log("MinIO URL received:", result.imageUrl);
        newImageUrls.push(result.imageUrl);
      }

      // Update form field with all image URLs
      const currentImages = form.getValues("picture");
      const allImages = currentImages ? 
        (Array.isArray(currentImages) ? [...currentImages, ...newImageUrls] : [currentImages, ...newImageUrls]) :
        newImageUrls;
      
      onChange(allImages);
      toast.success(`${files.length} image(s) uploaded successfully`);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
      // Reset previews on error
      setImagePreviews(prev => prev.slice(0, prev.length - newPreviews.length));
    }
  };

  const removeImage = (index: number, onChange: (value: string | string[]) => void) => {
    const currentImages = form.getValues("picture");
    const imageArray = Array.isArray(currentImages) ? currentImages : [currentImages].filter(Boolean);
    
    // Remove from form data
    const updatedImages = imageArray.filter((_, i) => i !== index);
    onChange(updatedImages.length === 0 ? "" : updatedImages);
    
    // Remove from previews
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
      image: data.picture, // This might need adjustment based on your API expectations
    };

    if (payload) {
      createService(payload).then(() => {
        toast.success("Service created successfully");
        form.reset();
        setImagePreviews([]); // Clear image previews on successful submission
      }).catch((err) => {
        toast.error(err.message);
      });
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

                {/* Service Images - Multiple Upload */}
                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Images</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple // Enable multiple file selection
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
                              Choose Images
                            </Button>
                          </div>

                          {/* Display all uploaded images */}
                          {(imagePreviews.length > 0 || field.value) && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={preview}
                                    alt={`Service preview ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="absolute -top-2 -right-2 w-6 h-6 p-0 text-red-600 hover:text-red-700 bg-white border border-gray-300 rounded-full"
                                    onClick={() => removeImage(index, field.onChange)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
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
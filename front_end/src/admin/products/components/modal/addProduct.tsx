import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ProdcutHeaders from "./prodcutHeaders";
import { Package, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ProductSchema } from "./productSchema";
import { productSchema } from "./productSchema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DetailsCard from "./detailCard";
import { Button } from "@/components/ui/button";
import { useCreateProductMutation } from "@/services/products/productApi";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function AddProduct() {
  const [createProduct] = useCreateProductMutation();
  
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      nameFr: "",
      size: "1m*1m",
      price: "",
      details: [
        {
          id: `initial-${Date.now()}`, // Add unique ID for initial detail
          colorEn: "",
          colorAr: "",
          colorFr: "",
          colorCode: "#000000", // Default color code
          quantity: 1,
          picture: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  const onSubmit = (data: ProductSchema) => {
    const payload = {
      name: {
        en: data.nameEn,
        fr: data.nameFr,
        ar: data.nameAr,
      },
      price: data.price,
      size: data.size,
      details: data.details.map((detail) => ({
        colorName: {
          en: detail.colorEn,
          fr: detail.colorFr,
          ar: detail.colorAr,
        },
        colorCode: detail.colorCode,
        quantity: detail.quantity,
        picture: detail.picture,
      })),
    };
    createProduct(payload)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        form.reset({
          nameEn: "",
          nameAr: "",
          nameFr: "",
          size: "1m*1m",
          price: "",
          details: [
            {
              id: `reset-${Date.now()}`, // New unique ID after reset
              colorEn: "",
              colorAr: "",
              colorFr: "",
              colorCode: "#000000",
              quantity: 1,
              picture: "",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Error creating product:", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        <Toaster richColors position="top-right" />
        <ProdcutHeaders 
          headerType={"Add New Product"} 
          text={"Create a new product with multiple color variations"} 
          backLink={"/admin/products"}
          name={"Product   "}
        />
      </div>
      <Form {...form}>
        <form
          action=""
          className="space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Card className="shadow-sm border-gray-200 mr-2 ml-2">
            <CardHeader className="p-2 m-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details of your product
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="nameEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name (English)</FormLabel>
                        <FormControl>
                          <Input
                            id="name-en"
                            placeholder="Enter product name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="nameFr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name (French)</FormLabel>
                        <FormControl>
                          <Input
                            id="name-fr"
                            placeholder="Enter product name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="nameAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name (Arabic)</FormLabel>
                        <FormControl>
                          <Input
                            id="name-ar"
                            placeholder="Enter product name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Price</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                              id="price"
                              placeholder="Enter product price"
                              {...field}
                              value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Size</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            type="text"
                            id="size"
                            placeholder="Enter product size"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <div>
            <DetailsCard
              control={form.control}
              fields={fields}
              append={append}
              remove={remove}
              formValues={form.watch("details")}
            />
          </div>
          <div className="flex justify-center mr-2 ml-2 mb-10">
            <Button
              type="submit"
              className="bg-gray-950 hover:bg-gray-800 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </form>
      </Form>
      <div style={{ height: "30px" }}></div>
    </div>
  );
}

export default AddProduct;
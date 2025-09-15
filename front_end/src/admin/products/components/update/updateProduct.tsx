import { Button } from "@/components/ui/button";
import { Package,Save } from "lucide-react";
import DetailsCard from "../modal/detailCard";
import { toast, Toaster } from "sonner";
import ProdcutHeaders from "../modal/prodcutHeaders";
import { useParams } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductSchema } from "../modal/productSchema";
import { useProductFromCache } from "@/hooks/useProductFromCache";
import {
  productApi,
  useUpdateProductMutation,
} from "@/services/products/productApi";
import { useEffect } from "react";

function UpdatedProduct() {
  const { id } = useParams<{ id: string }>();
  const productCash = useProductFromCache(id || "");
  const { data, isLoading } = productApi.endpoints.getProductById.useQuery(
    id!,
    { skip: !!productCash }
  );
  const product = productCash || data?.product?.[0];
  const [updateProduct] = useUpdateProductMutation();
  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nameEn: product?.name?.en || "",
      nameAr: product?.name?.ar || "",
      nameFr: product?.name?.fr || "",
      size: product?.size || "",
      price: product?.price ? String(product.price) : "",
      details: product?.details?.length
        ? product.details.map((d) => {
            return {
              id: d._id || "",
              colorEn: d.colorName?.en || "",
              colorAr: d.colorName?.ar || "",
              colorFr: d.colorName?.fr || "",
              colorCode: d.colorCode || "",
              quantity: d.quantity || 1,
              picture: d.picture || "",
            };
          })
        : [
            {
              id: "",
              colorEn: "",
              colorAr: "",
              colorFr: "",
              colorCode: "",
              quantity: 1,
              picture: "",
            },
          ],
    },
  });
  useEffect(() => {
    if (product) {
      form.reset({
        nameEn: product.name?.en || "",
        nameAr: product.name?.ar || "",
        nameFr: product.name?.fr || "",
        price: String(product.price) || "",
        size: product.size || "",
        details: product.details?.length
          ? product.details.map((d) => ({
              
              id: d._id,
              colorEn: d.colorName?.en || "",
              colorAr: d.colorName?.ar || "",
              colorFr: d.colorName?.fr || "",
              colorCode: d.colorCode || "#000000",
              quantity: d.quantity || 1,
              picture: d.picture || "",
            }))
          : [
              {
                id: "",
                colorEn: "",
                colorAr: "",
                colorFr: "",
                colorCode: "#000000",
                quantity: 1,
                picture: "",
              },
            ],
      });
    }
  }, [product, form]);

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
      price:data.price || 0,
      size: data.size,
      details: data.details.map((detail) => ({
        id: detail.id,
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

    if (window.confirm("Are you sure you want to update this product?")) {
      updateProduct({ id: product._id, payload })
        .then(() => {
          toast.success("Product updated successfully!");
        })
        .catch(() => {
          toast.warning("Product can not be updated!");
        });
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-8">
        <Toaster richColors position="top-right" />
        <ProdcutHeaders
          headerType={"Update Product"}
          text={"Update the product with multiple color variations"}
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
              <CardContent className="p-6 space-y-6 ">
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
            </CardHeader>
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
              <Save className="w-4 h-4" />
              Save Update 
            </Button>
          </div>
        </form>
      </Form>
      <div style={{ height: "30px" }}></div>
    </div>
  );
}
export default UpdatedProduct;

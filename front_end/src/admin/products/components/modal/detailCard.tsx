import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Plus, Trash2, Upload, X } from "lucide-react";
import {  useState } from "react";
import type { ProductSchema } from "./productSchema";
import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import {
  useDeleteDetailMutation,
  useUploadProductImageMutation,
} from "@/services/products/productApi";
import { toast, Toaster } from "sonner";

interface ProductDetailsFormProps {
  control: Control<ProductSchema>;
  fields: FieldArrayWithId<ProductSchema, "details", "id">[];
  append: UseFieldArrayAppend<ProductSchema, "details">;
  remove: UseFieldArrayRemove;
  formValues: any[];
}

function DetailsCard({
  control,
  fields,
  append,
  remove,
  formValues,
}: ProductDetailsFormProps) {
  const [imagePreview, setImagePreview] = useState<{ [key: string]: string }>(
    {}
  );

  const handleAddDetail = () => {
    append({
      id: `temp-${Date.now()}`,
      colorEn: "",
      colorAr: "",
      colorFr: "",
      colorCode: "#000000",
      quantity: 1,
      picture: "",
    });
  };

  const [uploadImage] = useUploadProductImageMutation();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    onChange: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((prev) => ({
          ...prev,
          [`detail-${index}`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      // Upload to MinIO
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImage(formData).unwrap();

      onChange(result.imageUrl);

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error); // Add this
      toast.error("Upload failed");
      setImagePreview((prev) => {
        const newPreview = { ...prev };
        delete newPreview[`detail-${index}`];
        return newPreview;
      });
    }
  };
  const [deleteDetail] = useDeleteDetailMutation();
  const removeImage = (index: number, onChange: (value: string) => void) => {
    onChange("");
    setImagePreview((prev) => {
      const newPreview = { ...prev };
      delete newPreview[`detail-${index}`];
      return newPreview;
    });
  };
  const removeDetail = (index: number) => {
  const currentDetailFormValue = formValues[index];
  const detailId = currentDetailFormValue.id;

  const isRealId = detailId && !detailId.startsWith("temp-");
  if (
    isRealId &&
    window.confirm("Are you sure you want to delete this detail?")
  ) {
    deleteDetail(detailId)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(err.data?.message || "Failed to delete detail");
      });
  } else {
    remove(index);
  }
};
  // const removeDetail = (index: number) => {
  //   const currentDetailFormValue = formValues[index];
  //   const detailId = currentDetailFormValue.id;

  //   const isRealId = detailId && !detailId.startsWith("temp-");
  //   if (
  //     isRealId &&
  //     window.confirm("Are you sure you want to delete this detail?")
  //   ) {
  //     deleteDetail(detailId)
  //       .unwrap()
  //       .then((res) => {
  //         toast.success(res.message);
  //       })
  //       .catch((err) => {
  //         toast.error(err.data?.message || "Failed to delete detail");
  //       });
  //   } else {
  //     remove(index);
  //   }
  // };

  return (
    <Card className="shadow-sm border-gray-200 mr-2 ml-2">
      <CardHeader className="p-2 m-4">
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Details
        </CardTitle>
        <CardDescription>
          Enter product color variations, quantities, and images
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <Toaster richColors position="top-right" />
        {fields.map((field, index) => (
          <div
            key={`detail-${index}-${field.id || "new"}`}
            className="border rounded-lg p-4 space-y-4 bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-gray-700">
                Detail #{index + 1}
              </h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    removeDetail(index);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>

            {/* Color Names Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`details.${index}.colorEn`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Red" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`details.${index}.colorFr`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color (French)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Rouge" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`details.${index}.colorAr`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color (Arabic)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., أحمر" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Color Code, Quantity, and Picture Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`details.${index}.colorCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Code</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          className="w-12 h-10 p-1 border rounded cursor-pointer"
                          {...field}
                        />
                        <Input
                          placeholder="#000000"
                          className="flex-1"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`details.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`details.${index}.picture`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageChange(e, index, field.onChange)
                            }
                            className="hidden"
                            id={`image-upload-${index}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() =>
                              document
                                .getElementById(`image-upload-${index}`)
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
                              onClick={() => removeImage(index, field.onChange)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {(field.value || imagePreview[`detail-${index}`]) && (
                          <div className="mt-2">
                            <img
                              src={
                                field.value || imagePreview[`detail-${index}`]
                              }
                              alt={`Preview for detail ${index + 1}`}
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
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 hover:bg-blue-50 hover:border-blue-300"
          onClick={handleAddDetail}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Detail
        </Button>
      </CardContent>
    </Card>
  );
}

export default DetailsCard;

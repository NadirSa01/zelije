import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { clientSchema, type ClientSchema } from "../add/clientSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast, Toaster } from "sonner";
import { useClientUpdate } from "@/contexts/common/useClientUpdate";
import { useEffect } from "react";
import { useUpdateClientMutation } from "@/services/clients/clientApi";

function UpdateSheet() {
  const[updateClient]=useUpdateClientMutation()
  const { isOpen, changeOpen, client } = useClientUpdate();
  const form = useForm<ClientSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: client?.fullName || "",
      telephone: client?.telephone || "",
      city: client?.city || "",
      address: client?.address || "",
    },
  });
  useEffect(() => {
    if (client) {
      form.reset({
        fullName: client?.fullName || "",
        telephone: client?.telephone || "",
        city: client?.city || "",
        address: client?.address || "",
      });
    }
  },[client]);
  const onSubmit = (data: ClientSchema) => {
    updateClient({id:client?._id,data})
    .then(()=>{
      toast.success("Product updated successfully!")
    })
    .catch(()=>{
          toast.warning("Product can not be updated!");
      
    })
  };

  return (
    <div className="mb-8">
      <Toaster richColors position="top-right" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={changeOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Update Client</SheetTitle>
                <SheetDescription>
                  Update your client here. Click save when you&apos;re done.
                </SheetDescription>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="sheet-demo-name">
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="sheet-demo-name"
                                placeholder="Nadir Satori"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="sheet-demo-telephone">
                              Telephone
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="sheet-demo-telephone"
                                placeholder="060000000"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="sheet-demo-city">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="sheet-demo-city"
                                placeholder="Fes"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-3">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="sheet-demo-address">
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="sheet-demo-address"
                                placeholder="Fes"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button type="submit">Update client</Button>
                    <SheetClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => changeOpen(false)}
                        type="button"
                      >
                        Close
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}

export default UpdateSheet;

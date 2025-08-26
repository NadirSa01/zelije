// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { useCreateClientMutation } from "@/services/clients/clientApi";
// import { useForm } from "react-hook-form";
// import { clientSchema, type ClientSchema } from "./clientSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { toast, Toaster } from "sonner";

function ClientHeader() {
  // const [createClient] = useCreateClientMutation();
  
  // const form = useForm<ClientSchema>({
  //   resolver: zodResolver(clientSchema),
  // });

  // const onSubmit = (data: ClientSchema) => {
  //   createClient(data).then(() => {
  //     toast.success("Client created successfully");
  //     form.reset();
  //   }).catch(err => {
  //     console.error(err);
  //     toast.error("Failed to create client");
  //   });
  // };

  return (
    <div className="mb-8">
        {/* <Toaster richColors position="top-right" /> */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Client Management
          </h1>
          <p className="text-gray-600">Manage your Client ...</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger>
              <Button className="bg-gray-950 hover:bg-gray-800 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Client
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add Client</SheetTitle>
                <SheetDescription>
                  Add your client here. Click save when you&apos;re done.
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
                            <FormLabel htmlFor="sheet-demo-name">Full Name</FormLabel>
                            <FormControl>
                              <Input id="sheet-demo-name" placeholder="Nadir Satori" {...field} />
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
                            <FormLabel htmlFor="sheet-demo-telephone">Telephone</FormLabel>
                            <FormControl>
                              <Input id="sheet-demo-telephone" placeholder="060000000" {...field} />
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
                            <FormLabel htmlFor="sheet-demo-city">City</FormLabel>
                            <FormControl>
                              <Input id="sheet-demo-city" placeholder="Fes" {...field} />
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
                            <FormLabel htmlFor="sheet-demo-address">Address</FormLabel>
                            <FormControl>
                              <Input id="sheet-demo-address" placeholder="Fes" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <SheetFooter>
                    <Button type="submit">Add client</Button>
                    <SheetClose asChild>
                      <Button variant="outline" type="button">Close</Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div> */}
      </div>
    </div>
  );
}

export default ClientHeader;
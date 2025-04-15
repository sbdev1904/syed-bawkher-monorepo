"use client";
import React, { useEffect } from "react";
import customerService from "../../services/customerService";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CreateCustomerModalProps {
  isOpen: boolean;
  isCancel: () => void;
  customerid?: string | number | null;
}

const customerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  office_phone: z.string().optional(),
  residential_phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  add1: z.string().optional(),
  add2: z.string().optional(),
  add3: z.string().optional(),
  add4: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

const CreateCustomerModal = ({
  isOpen,
  isCancel,
  customerid = null,
}: CreateCustomerModalProps) => {
  const { toast } = useToast();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      mobile: "",
      office_phone: "",
      residential_phone: "",
      email: "",
      add1: "",
      add2: "",
      add3: "",
      add4: "",
    },
  });

  useEffect(() => {
    if (customerid && isOpen) {
      customerService
        .findById(String(customerid))
        .then((data) => {
          form.reset({
            first_name: data.first_name || "",
            middle_name: data.middle_name || "",
            last_name: data.last_name || "",
            mobile: data.mobile || "",
            add1: data.add1 || "",
            add2: data.add2 || "",
            add3: data.add3 || "",
            add4: data.add4 || "",
            email: data.email || "",
            office_phone: data.office_phone || "",
            residential_phone: data.residential_phone || "",
          });
        })
        .catch((error) => {
          console.error("Failed to fetch customer:", error);
          toast({
            title: "Error",
            description: "Failed to load customer data.",
            variant: "destructive",
          });
        });
    }
  }, [customerid, isOpen, form, toast]);

  const handleSubmit = async (values: CustomerFormValues) => {
    try {
      if (customerid) {
        await customerService.updateCustomer(String(customerid), values);
        toast({
          title: "Success",
          description: "Customer updated successfully!",
        });
      } else {
        await customerService.createCustomer(values);
        toast({
          title: "Success",
          description: "Customer created successfully!",
        });
      }
      form.reset();
      isCancel(); // Close modal after successful submission
    } catch (error) {
      console.error("Failed to process customer:", error);
      toast({
        title: "Error",
        description:
          "Failed to process customer. Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && isCancel()}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            {customerid ? "Edit Customer" : "Create Customer"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h2 className="text-gray-600 text-lg font-medium">Name</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middle_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-gray-600 text-lg font-medium">Contact</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="office_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Office Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="residential_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residential Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <h2 className="text-gray-600 text-lg font-medium">Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="add1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Line 1</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="add2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Line 2</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="add3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Line 3</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="add4"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Line 4</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={isCancel}>
                Cancel
              </Button>
              <Button type="submit">{customerid ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomerModal;

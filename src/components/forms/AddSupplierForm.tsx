"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import supplierService from "../../services/supplierService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

// Create zod schema for validation
const supplierFormSchema = z.object({
  supplier_name: z.string().min(1, "Supplier name is required"),
  add1: z.string().min(1, "Primary address is required"),
  add2: z.string().optional(),
  add3: z.string().optional(),
  phone_number1: z.string().min(1, "Primary phone number is required"),
  phone_number2: z.string().optional(),
  phone_number3: z.string().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  primary_contact_name1: z.string().min(1, "Primary contact name is required"),
  primary_contact_name2: z.string().optional(),
  primary_contact_name3: z.string().optional(),
  notes: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierFormSchema>;

interface AddSupplierFormProps {
  onSuccess?: () => void;
}

const AddSupplierForm = ({ onSuccess }: AddSupplierFormProps) => {
  const { toast } = useToast();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      supplier_name: "",
      add1: "",
      add2: "",
      add3: "",
      phone_number1: "",
      phone_number2: "",
      phone_number3: "",
      email: "",
      primary_contact_name1: "",
      primary_contact_name2: "",
      primary_contact_name3: "",
      notes: "",
    }
  });

  const onSubmit = async (values: SupplierFormValues) => {
    try {
      const supplierData = {
        ...values,
        supplier_id: uuidv4(),
        add2: values.add2 || "",
        add3: values.add3 || "",
        phone_number2: values.phone_number2 || "",
        phone_number3: values.phone_number3 || "",
        primary_contact_name2: values.primary_contact_name2 || "",
        primary_contact_name3: values.primary_contact_name3 || "",
        notes: values.notes || "",
      };
      await supplierService.createSupplier(supplierData);
      toast({
        title: "Success",
        description: "Supplier created successfully",
      });
      form.reset();
      if (onSuccess) {
        onSuccess(); // Close the modal or perform other success actions
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to create supplier: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="supplier_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="add1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter primary address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="add2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter secondary address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="add3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter additional address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter primary phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter secondary phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="phone_number3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter additional phone number" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_contact_name1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Name 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter primary contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_contact_name2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Name 2</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter secondary contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primary_contact_name3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Contact Name 3</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter additional contact name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Full width fields at bottom */}
          <div className="mt-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any notes about the supplier"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" className="w-[200px]">Add Supplier</Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default AddSupplierForm;

"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import fabricService from "../../services/fabricService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

// Create zod schema for validation
const fabricFormSchema = z.object({
  fabric_code: z.string().min(1, "Fabric code is required"),
  description: z.string().min(1, "Description is required"),
  available_length: z.number().positive("Available length must be positive"),
  fabric_brand: z.string().min(1, "Fabric brand is required"),
  stock_location: z.string().optional(),
});

type FabricFormValues = z.infer<typeof fabricFormSchema>;

interface AddTextileFormProps {
  onSuccess?: () => void;
}

const AddTextileForm = ({ onSuccess }: AddTextileFormProps) => {
  const { toast } = useToast();

  const form = useForm<FabricFormValues>({
    resolver: zodResolver(fabricFormSchema),
    defaultValues: {
      fabric_code: "",
      description: "",
      fabric_brand: "",
      stock_location: "",
    }
  });

  const onSubmit = async (values: FabricFormValues) => {
    try {
      await fabricService.createFabric(values);
      toast({
        title: "Success",
        description: "Fabric created successfully",
      });
      form.reset();
      if (onSuccess) {
        onSuccess(); // Call the onSuccess callback to close the modal
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error",
        description: `Failed to create fabric: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fabric_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fabric Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter fabric Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter fabric description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Length</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter available length in meters"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fabric_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fabric Brand</FormLabel>
              <FormControl>
                <Input placeholder="Enter fabric brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter stock location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AddTextileForm;

"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Create zod schema for validation
const fabricFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  available_length: z.number().positive("Available length must be positive"),
  fabric_code: z.string().min(1, "Fabric code is required"),
  stock_location: z.string().min(1, "Stock location is required"),
});

type FabricFormValues = z.infer<typeof fabricFormSchema>;

interface EditTextileFormProps {
  fabric: {
    description: string;
    available_length: number;
    fabric_code: string;
    stock_location: string;
  };
  onSubmit: (values: FabricFormValues) => void;
}

const EditTextileForm = ({ fabric, onSubmit }: EditTextileFormProps) => {
  const form = useForm<FabricFormValues>({
    resolver: zodResolver(fabricFormSchema),
    defaultValues: {
      description: fabric.description,
      available_length: fabric.available_length,
      fabric_code: fabric.fabric_code,
      stock_location: fabric.stock_location,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
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
                  step={0.01}
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
          name="fabric_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fabric Code</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update Fabric</Button>
      </form>
    </Form>
  );
};

export default EditTextileForm;

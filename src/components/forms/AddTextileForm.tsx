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
  name: z.string().min(1, "Name is required"),
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
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FabricFormValues>({
    resolver: zodResolver(fabricFormSchema),
    defaultValues: {
      name: "",
      fabric_code: "",
      description: "",
      available_length: 0,
      fabric_brand: "",
      stock_location: "",
    }
  });

  const onSubmit = async (values: FabricFormValues) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter fabric name" {...field} />
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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddTextileForm;

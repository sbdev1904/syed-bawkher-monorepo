"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import fabricOrderService from "../../services/fabricOrderListService";
import supplierService from "../../services/supplierService";

// Define the form schema
const formSchema = z.object({
  fabric_id: z.string().min(1, "Fabric ID is required"),
  description: z.string().min(1, "Description is required"),
  supplier_name: z.string().min(1, "Please select a supplier"),
  meters: z.coerce.number().min(0, "Meters must be 0 or greater"),
  ordered_date: z.date().optional(),
  ordered_for: z.string().min(1, "Please input who the order is for"),
});

type FormValues = z.infer<typeof formSchema>;

const AddFabricPurchaseOrderForm = ({ onSuccess, fabricId }: { onSuccess?: () => void; fabricId?: string }) => {
  const [suppliers, setSuppliers] = useState<Array<{ supplier_id: string; supplier_name: string }>>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fabric_id: fabricId || "",
      description: "",
      supplier_name: "",
      meters: 0,
      ordered_date: new Date(),
      ordered_for: "",
    },
  });

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierList = await supplierService.getAllSuppliers();
        setSuppliers(supplierList);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load suppliers";
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
      }
    };

    fetchSuppliers();
  }, [toast]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const formattedValues = {
        ...values,
        supplier_id: selectedSupplierId,
      };

      await fabricOrderService.createFabricOrder(formattedValues);

      toast({
        title: "Success",
        description: "Fabric Purchase Order created successfully",
      });

      form.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create fabric order";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  const handleSupplierChange = (value: string) => {
    const selectedSupplier = suppliers.find(supplier => supplier.supplier_name === value);
    if (selectedSupplier) {
      setSelectedSupplierId(selectedSupplier.supplier_id);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fabric_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fabric ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter fabric ID"
                  disabled={!!fabricId}
                  {...field}
                />
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
                <Input placeholder="Enter purchase order description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplier_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supplier Name</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleSupplierChange(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem
                      key={supplier.supplier_id}
                      value={supplier.supplier_name}
                    >
                      {supplier.supplier_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meters</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder="Enter meters"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ordered_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Ordered Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ordered_for"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordered For</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name or purpose" {...field} />
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

export default AddFabricPurchaseOrderForm;

"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

// Import Item type
interface Item {
  item_name: string;
  item_type: "jacket" | "shirt" | "pant";
  fabric_id?: string;
  lining_fabric_id?: string;
  key: string;
}

export const orderDetailsSchema = z.object({
  orderNo: z.string().min(1, "Order number is required"),
  date: z.date().optional(),
  note: z.string().optional(),
});

export type OrderDetailsFormData = z.infer<typeof orderDetailsSchema>;

interface FormValues extends OrderDetailsFormData {
  items: Item[];
  jacket: {
    jacket_length: string;
    natural_length: string;
    back_length: string;
    x_back: string;
    half_shoulder: string;
    to_sleeve: string;
    chest: string;
    waist: string;
    collar: string;
    waist_coat_length: string;
    sherwani_length: string;
    other_notes: string;
  };
  shirt: {
    length: string;
    half_shoulder: string;
    to_sleeve: string;
    chest: string;
    waist: string;
    collar: string;
    other_notes: string;
  };
  pant: {
    length: string;
    inseem: string;
    waist: string;
    hips: string;
    bottom: string;
    knee: string;
    other_notes: string;
  };
  customerId?: string;
  [key: string]: unknown;
}

interface OrderDetailsFormProps {
  form: UseFormReturn<FormValues>;
  formData: OrderDetailsFormData;
  setFormData: (data: OrderDetailsFormData) => void;
}

const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({
  form,
}) => {
  return (
    <Form {...form}>
      <form className="space-y-6 w-full max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="orderNo"
            rules={{
              required: "Please enter an order number"
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter order number"
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-2">Date</FormLabel>
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />

                <FormDescription>
                  If no date is provided, today&apos;s date will be used.
                </FormDescription>
              </FormItem>

            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormDescription>Any special notes for the order</FormDescription>
              <FormControl>
                <Textarea
                  {...field}
                  rows={3}
                  placeholder="Enter any special notes or requirements"
                  className="resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default OrderDetailsForm;

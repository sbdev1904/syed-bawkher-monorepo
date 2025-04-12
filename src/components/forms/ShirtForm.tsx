"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface Item {
  item_name: string;
  item_type: "jacket" | "shirt" | "pant";
  fabric_id?: string;
  lining_fabric_id?: string;
  key: string;
}

interface FormValues {
  orderNo: string;
  date?: Date;
  note?: string;
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

interface ShirtFormProps {
  form: UseFormReturn<FormValues>;
}

const ShirtForm = ({ form }: ShirtFormProps) => {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-3 justify-items-between gap-2">
        <FormField
          control={form.control}
          name="shirt.length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shirt Length</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shirt.half_shoulder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Half Shoulder</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shirt.to_sleeve"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To Sleeve</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shirt.chest"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chest</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shirt.waist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Waist</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shirt.collar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collar</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="shirt.other_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shirt Notes</FormLabel>
            <FormControl>
              <Textarea {...field} rows={2} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default ShirtForm;

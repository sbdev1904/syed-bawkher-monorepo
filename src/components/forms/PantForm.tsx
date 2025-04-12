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

interface PantFormProps {
  form: UseFormReturn<FormValues>;
}

const PantForm = ({ form }: PantFormProps) => {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-3 justify-items-between gap-2">
        <FormField
          control={form.control}
          name="pant.length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pant Length</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pant.inseem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pant Inseem</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pant.waist"
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
          name="pant.hips"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hips</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pant.bottom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bottom</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pant.knee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Knee</FormLabel>
              <FormControl>
                <Input {...field} className="" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="pant.other_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pant Notes</FormLabel>
            <FormControl>
              <Textarea {...field} rows={2} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default PantForm;

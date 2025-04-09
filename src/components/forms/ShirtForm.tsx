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

interface ShirtFormProps {
  form: UseFormReturn<any>;
  requiredFieldRule?: any;
}

const ShirtForm = ({ form, requiredFieldRule = null }: ShirtFormProps) => {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-3 justify-items-end">
        <FormField
          control={form.control}
          name="shirt.length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shirt Length</FormLabel>
              <FormControl>
                <Input {...field} className="w-10" />
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
                <Input {...field} className="w-10" />
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
                <Input {...field} className="w-10" />
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
                <Input {...field} className="w-10" />
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
                <Input {...field} className="w-10" />
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
                <Input {...field} className="w-10" />
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

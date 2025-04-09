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

interface JacketFormProps {
  form: UseFormReturn<any>;
  requiredFieldRule?: any;
}

const JacketForm = ({ form, requiredFieldRule = null }: JacketFormProps) => {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-3 justify-items-end">
        <FormField
          control={form.control}
          name="jacket.jacket_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jacket Length</FormLabel>
              <FormControl>
                <Input {...field} className="w-10" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jacket.natural_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Natural Length</FormLabel>
              <FormControl>
                <Input {...field} className="w-10" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jacket.back_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back Length</FormLabel>
              <FormControl>
                <Input {...field} className="w-10" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jacket.x_back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cross Back</FormLabel>
              <FormControl>
                <Input {...field} className="w-10" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jacket.half_shoulder"
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
          name="jacket.to_sleeve"
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
          name="jacket.chest"
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
          name="jacket.waist"
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
          name="jacket.collar"
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
      <div className="grid grid-flow-row-dense md:grid-cols-2 justify-items-end">
        <FormField
          control={form.control}
          name="jacket.waist_coat_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vest Coat Length</FormLabel>
              <FormControl>
                <Input {...field} className="w-10" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jacket.sherwani_length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sherwani Length</FormLabel>
              <FormControl>
                <Input {...field} className="w-10" />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="jacket.other_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jacket Notes</FormLabel>
            <FormControl>
              <Textarea {...field} rows={2} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default JacketForm;

"use client";
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

// Define the schema type for form values
export const customerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  mobile: z.string().min(1, "Mobile number is required"),
  office_phone: z.string().optional(),
  residential_phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  add1: z.string().optional(),
  add2: z.string().optional(),
  add3: z.string().optional(),
  add4: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

interface CreateCustomerFormProps {
  form: UseFormReturn<CustomerFormValues>;
}

const CreateCustomerForm = ({ form }: CreateCustomerFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-gray-600 text-lg font-medium">Name</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-gray-600 text-lg font-medium">Contact</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="office_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="residential_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residential Phone</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-gray-600 text-lg font-medium">Address</h2>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="add1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 1</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="add2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 2</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="add3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 3</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="add4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line 4</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerForm;

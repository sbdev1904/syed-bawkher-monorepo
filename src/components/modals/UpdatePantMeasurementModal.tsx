"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PantForm from "../forms/PantForm";
import pantService from "../../services/pantService";

interface PantFields {
  length: string;
  inseem: string;
  waist: string;
  hips: string;
  bottom: string;
  knee: string;
  other_notes: string;
}

export interface PantMeasurement extends PantFields {
  measurement_id: string;
}

export interface FormValues {
  pant: PantMeasurement;
  [key: string]: unknown;
}

interface UpdatePantMeasurementModalProps {
  isOpen: boolean;
  onCancel: () => void;
  measurement: PantMeasurement;
}

const UpdatePantMeasurementModal = ({
  isOpen,
  onCancel,
  measurement,
}: UpdatePantMeasurementModalProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      pant: measurement,
    },
  });

  useEffect(() => {
    if (isOpen && measurement) {
      form.reset({ pant: measurement });
    }
  }, [isOpen, measurement, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { pant } = values;
      await pantService.updatePantMeasurement(measurement.measurement_id, pant);
      toast({
        title: "Success",
        description: "Pant measurement updated successfully",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating pant measurement:", error);
      toast({
        title: "Error",
        description: "Failed to update pant measurement",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Pant Measurement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {
              //@ts-expect-error interface mismatch not a problem
              <PantForm form={form} />
            }
            <DialogFooter className="mt-4">
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePantMeasurementModal;

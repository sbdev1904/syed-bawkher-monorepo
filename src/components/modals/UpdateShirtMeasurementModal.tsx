"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import ShirtForm from "../forms/ShirtForm";
import shirtService from "../../services/shirtService";

interface ShirtFields {
  length: string;
  half_shoulder: string;
  to_sleeve: string;
  chest: string;
  waist: string;
  collar: string;
  other_notes: string;
}

export interface ShirtMeasurement extends ShirtFields {
  measurement_id: string;
}

interface FormValues {
  shirt: ShirtMeasurement;
  [key: string]: unknown;
}

interface UpdateShirtMeasurementModalProps {
  isOpen: boolean;
  onCancel: () => void;
  measurement: ShirtMeasurement;
}

const UpdateShirtMeasurementModal = ({
  isOpen,
  onCancel,
  measurement,
}: UpdateShirtMeasurementModalProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      shirt: measurement,
    },
  });

  useEffect(() => {
    if (isOpen && measurement) {
      form.reset({ shirt: measurement });
    }
  }, [isOpen, measurement, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { shirt } = values;
      await shirtService.updateShirtMeasurement(
        measurement.measurement_id,
        shirt
      );
      toast({
        title: "Success",
        description: "Shirt measurement updated successfully",
      });
      onCancel();
      // Refresh data instead of reloading the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating shirt measurement:", error);
      toast({
        title: "Error",
        description: "Failed to update shirt measurement",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Shirt Measurement</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {
              //@ts-expect-error interface mismatch not a problem

              <ShirtForm form={form} />
            }

            <DialogFooter className="mt-6">
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateShirtMeasurementModal;

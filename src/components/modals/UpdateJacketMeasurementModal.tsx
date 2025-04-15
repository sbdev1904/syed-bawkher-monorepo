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
import JacketForm from "../forms/JacketForm";
import jacketService from "../../services/jacketService";

interface JacketFields {
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
}

export interface JacketMeasurement extends JacketFields {
  measurement_id: string;
}

export interface FormValues {
  jacket: JacketMeasurement;
  [key: string]: unknown;
}

interface UpdateJacketMeasurementModalProps {
  isOpen: boolean;
  onCancel: () => void;
  measurement: JacketMeasurement;
}

const UpdateJacketMeasurementModal = ({
  isOpen,
  onCancel,
  measurement,
}: UpdateJacketMeasurementModalProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    defaultValues: {
      jacket: measurement,
    },
  });

  useEffect(() => {
    if (isOpen && measurement) {
      form.reset({ jacket: measurement });
    }
  }, [isOpen, measurement, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      const { jacket } = values;
      await jacketService.updateJacketMeasurement(
        measurement.measurement_id,
        jacket
      );
      toast({
        title: "Success",
        description: "Jacket measurement updated successfully",
      });
      onCancel();
      // Refresh data instead of reloading the page
      window.location.reload();
    } catch (error) {
      console.error("Error updating jacket measurement:", error);
      toast({
        title: "Error",
        description: "Failed to update jacket measurement",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Jacket Measurement</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            {
              //@ts-expect-error interface mismatch not a problem

              <JacketForm form={form} />
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

export default UpdateJacketMeasurementModal;

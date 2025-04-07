"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import EditTextileForm from "../forms/EditTextileForm";
import fabricService from "../../services/fabricService";

interface EditTextileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fabric: {
    fabric_id: string;
    description: string;
    available_length: number;
    fabric_code: string;
    stock_location: string;
  };
  onUpdate: (updatedFabric: any) => void;
}

const EditTextileModal = ({ open, onOpenChange, fabric, onUpdate }: EditTextileModalProps) => {
  const { toast } = useToast();

  const handleFormSubmit = async (updatedFields: any) => {
    try {
      await fabricService.updateFabric(fabric.fabric_id, updatedFields);
      const updatedFabric = await fabricService.getFabricById(fabric.fabric_id);
      onUpdate(updatedFabric);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Fabric updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating fabric:", error);
      toast({
        title: "Error",
        description: "Failed to update fabric.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Fabric</DialogTitle>
        </DialogHeader>
        <EditTextileForm fabric={fabric} onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTextileModal;

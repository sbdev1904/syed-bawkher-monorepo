"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddTextileForm from "../forms/AddTextileForm";

interface AddTextileModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const AddTextileModal = ({ isOpen, onCancel, onSuccess }: AddTextileModalProps) => {
  const handleSuccess = () => {
    onCancel();
    onSuccess?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Textile</DialogTitle>
        </DialogHeader>
        <AddTextileForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTextileModal;

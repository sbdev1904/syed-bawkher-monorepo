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
}

const AddTextileModal = ({ isOpen, onCancel }: AddTextileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Textile</DialogTitle>
        </DialogHeader>
        <AddTextileForm onSuccess={onCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default AddTextileModal;

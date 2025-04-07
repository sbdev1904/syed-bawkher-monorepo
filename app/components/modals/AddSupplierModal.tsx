"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddSupplierForm from "../forms/AddSupplierForm";

interface AddSupplierModalProps {
  isOpen: boolean;
  onCancel: () => void;
}

const AddSupplierModal = ({ isOpen, onCancel }: AddSupplierModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Supplier</DialogTitle>
        </DialogHeader>
        <AddSupplierForm onSuccess={onCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplierModal;

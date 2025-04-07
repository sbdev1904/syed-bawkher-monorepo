"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddFabricPurchaseOrderForm from "../forms/AddFabricPurchaseOrderForm";

interface AddFabricPurchaseOrderModalProps {
  isOpen: boolean;
  onCancel: () => void;
  fabricId: string;
}

const AddFabricPurchaseOrderModal = ({
  isOpen,
  onCancel,
  fabricId
}: AddFabricPurchaseOrderModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Fabric Purchase Order</DialogTitle>
        </DialogHeader>
        <AddFabricPurchaseOrderForm onSuccess={onCancel} fabricId={fabricId} />
      </DialogContent>
    </Dialog>
  );
};

export default AddFabricPurchaseOrderModal;

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import MergeUserForm from "../forms/MergeUserForm";

interface MergeUserModalProps {
  isOpen: boolean;
  onCancel: () => void;
  customer_id?: string | null;
}

const MergeUserModal = ({ isOpen, onCancel, customer_id = null }: MergeUserModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Merge into user: {customer_id}</DialogTitle>
        </DialogHeader>
        <MergeUserForm targetCustomerID={customer_id} />
      </DialogContent>
    </Dialog>
  );
};

export default MergeUserModal;

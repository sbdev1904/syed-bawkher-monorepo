"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddTailorForm } from "../forms/AddTailorForm";
import tailorService from "../../services/tailorService";

interface AddTailorModalProps {
    isOpen: boolean;
    onCancel: () => void;
}

const AddTailorModal = ({ isOpen, onCancel }: AddTailorModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="min-w-5xl">
                <DialogHeader>
                    <DialogTitle>Add New Tailor</DialogTitle>
                </DialogHeader>
                <AddTailorForm
                    onSubmit={async (values) => {
                        await tailorService.createTailor(values);
                        onCancel();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddTailorModal; 
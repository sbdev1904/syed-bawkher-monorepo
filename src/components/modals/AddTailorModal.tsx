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
                        const tailorInput = {
                            ...values,
                            last_name: values.last_name || "",
                            experience_years: values.experience_years || 0,
                            address: values.address || "",
                            email: values.email || "",
                            emergency_contact: values.emergency_contact || "",
                            hourly_rate: values.hourly_rate || 0,
                        };
                        await tailorService.createTailor(tailorInput);
                        onCancel();
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddTailorModal; 
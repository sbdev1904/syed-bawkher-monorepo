"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddTailorModal from "../modals/AddTailorModal";

interface AddTailorButtonProps {
    onSuccess?: () => void;
}

const AddTailorButton = ({ onSuccess }: AddTailorButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
        setIsModalOpen(false);
        onSuccess?.();
    };

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>Add New Tailor</Button>
            <AddTailorModal
                isOpen={isModalOpen}
                onCancel={handleCancel}
            />
        </>
    );
};

export default AddTailorButton; 
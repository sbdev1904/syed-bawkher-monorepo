"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddTailorModal from "../modals/AddTailorModal";

const AddTailorButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>Add New Tailor</Button>
            <AddTailorModal
                isOpen={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default AddTailorButton; 
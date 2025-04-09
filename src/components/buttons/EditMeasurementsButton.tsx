"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateJacketMeasurementModal from "../modals/UpdateJacketMeasurementModal";
import UpdatePantMeasurementModal from "../modals/UpdatePantMeasurementModal";
import UpdateShirtMeasurementModal from "../modals/UpdateShirtMeasurementModal";

interface EditMeasurementsButtonProps {
  measurementType: "jacket" | "pant" | "shirt";
  measurement: any;
}

const EditMeasurementsButton = ({ measurementType, measurement }: EditMeasurementsButtonProps) => {
  const [isEditMeasurementModalVisible, setIsEditMeasurementModalVisible] =
    useState(false);

  const handleOpenModal = () => {
    setIsEditMeasurementModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsEditMeasurementModalVisible(false);
  };

  const renderModal = () => {
    switch (measurementType) {
      case "jacket":
        return (
          <UpdateJacketMeasurementModal
            isOpen={isEditMeasurementModalVisible}
            onCancel={handleCloseModal}
            measurement={measurement}
          />
        );
      case "pant":
        return (
          <UpdatePantMeasurementModal
            isOpen={isEditMeasurementModalVisible}
            onCancel={handleCloseModal}
            measurement={measurement}
          />
        );
      case "shirt":
        return (
          <UpdateShirtMeasurementModal
            isOpen={isEditMeasurementModalVisible}
            onCancel={handleCloseModal}
            measurement={measurement}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full" onClick={handleOpenModal}>
              Edit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Measurement</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {renderModal()}
    </div>
  );
};

export default EditMeasurementsButton;

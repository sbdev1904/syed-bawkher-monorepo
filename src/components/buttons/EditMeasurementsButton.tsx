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

interface JacketMeasurement {
  measurement_id: string;
  jacket_length: string;
  natural_length: string;
  back_length: string;
  x_back: string;
  half_shoulder: string;
  to_sleeve: string;
  chest: string;
  waist: string;
  collar: string;
  waist_coat_length: string;
  sherwani_length: string;
  other_notes: string;
}

interface ShirtMeasurement {
  measurement_id: string;
  length: string;
  half_shoulder: string;
  to_sleeve: string;
  chest: string;
  waist: string;
  collar: string;
  other_notes: string;
}

interface PantMeasurement {
  measurement_id: string;
  length: string;
  inseem: string;
  waist: string;
  hips: string;
  bottom: string;
  knee: string;
  other_notes: string;
}

interface EditMeasurementsButtonProps {
  measurementType: "jacket" | "pant" | "shirt";
  measurement: JacketMeasurement | PantMeasurement | ShirtMeasurement;
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
            measurement={measurement as JacketMeasurement}
          />
        );
      case "pant":
        return (
          <UpdatePantMeasurementModal
            isOpen={isEditMeasurementModalVisible}
            onCancel={handleCloseModal}
            measurement={measurement as PantMeasurement}
          />
        );
      case "shirt":
        return (
          <UpdateShirtMeasurementModal
            isOpen={isEditMeasurementModalVisible}
            onCancel={handleCloseModal}
            measurement={measurement as ShirtMeasurement}
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

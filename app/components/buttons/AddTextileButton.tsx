"use client";

import React, { useState } from "react";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddTextileModal from "../modals/AddTextileModal";

const AddTextileButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={showModal}
            >
              <CirclePlus className="h-5 w-5" />
              Add New Textile
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Textile</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AddTextileModal isOpen={isModalVisible} onCancel={handleCancel} />
    </>
  );
};

export default AddTextileButton;

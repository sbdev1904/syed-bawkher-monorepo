"use client";

import React, { useState } from "react";
import { PenSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";
import { Button } from "../../../app/components/ui/button-wrapper";
import AddItemsModal from "../modals/AddItemsModal";

const AddItemsButton = ({ orderNo }: { orderNo: string }) => {
  const [isItemsModalVisible, setIsItemsModalVisible] = useState(false);

  const handleItemsModal = () => {
    setIsItemsModalVisible(true);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="primary" icon={<PenSquare size={16} />} onClick={handleItemsModal}>
              Add more Items
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add More Items</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AddItemsModal
        isOpen={isItemsModalVisible}
        isCancel={() => setIsItemsModalVisible(false)}
        orderNo={orderNo}
      />
    </>
  );
};

export default AddItemsButton;

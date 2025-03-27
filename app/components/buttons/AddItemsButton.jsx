import React, { useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { Button, Tooltip } from "antd";
import AddItemsModal from "../modals/AddItemsModal";


const AddItemsButton = ({orderNo}) => {
    const [isItemsModalVisible, setIsItemsModalVisible] = useState(false);
    
    const handleItemsModal = () => {
        setIsItemsModalVisible(true);
      };

  return (
    <>
    <Tooltip title="Add More Items">
      <Button
        type="primary"
        icon={<IoMdCreate />}
        onClick={handleItemsModal}
      >Add more Items</Button>
    </Tooltip>
    <AddItemsModal isOpen={isItemsModalVisible} isCancel={() => setIsItemsModalVisible(false)} orderNo={orderNo}/>
  </>
  )
}

export default AddItemsButton
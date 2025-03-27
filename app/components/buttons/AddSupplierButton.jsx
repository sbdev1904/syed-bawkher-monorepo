import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Button, Tooltip } from "antd";
import AddSupplierModal from "../modals/AddSupplierModal";

const AddSupplierButton = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Tooltip title="Add New Textile">
        <Button
          className="flex flex-row items-center space-x-1"
          type="primary"
          onClick={showModal}
        >
          <IoMdAddCircle />
          Add New Supplier
        </Button>
      </Tooltip>
      <AddSupplierModal isOpen={isModalVisible} onCancel={handleCancel} />
    </>
  );
};

export default AddSupplierButton;

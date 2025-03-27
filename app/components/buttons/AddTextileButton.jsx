"use client";

import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Button, Tooltip } from "antd";
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
      <Tooltip title="Add New Textile">
        <Button
          className="flex flex-row items-center space-x-1"
          type="primary"
          onClick={showModal}
        >
          <IoMdAddCircle />
          Add New Textile
        </Button>
      </Tooltip>
      <AddTextileModal isOpen={isModalVisible} onCancel={handleCancel} />
    </>
  );
};

export default AddTextileButton;

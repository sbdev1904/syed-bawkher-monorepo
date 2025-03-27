"use client";
import React, { useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { Button, Tooltip } from "antd";
import CreateCustomerModal from "../modals/CreateCustomerModal";

const CreateCustomerButton = ({ customerId = Number | null }) => {
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] =
    useState(false);

  const handleCreateCustomer = () => {
    setIsCreateCustomerModalVisible(true);
  };

  return (
    <>
      <Tooltip title={customerId ? "Edit Customer" : "Create Customer"}>
        <Button
          type={customerId ? "link" : "primary"}
          shape="circle"
          icon={<IoMdCreate />}
          className={customerId ? "text-lg text-white" : "ml-2"}
          onClick={handleCreateCustomer}
        />
      </Tooltip>
      <CreateCustomerModal
        isOpen={isCreateCustomerModalVisible}
        isCancel={() => setIsCreateCustomerModalVisible(false)}
        customerid={customerId} // Pass customerId to the modal
      />
    </>
  );
};

export default CreateCustomerButton;

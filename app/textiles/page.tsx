import React from "react";
import TextileTable from "../components/tables/TextileTable";
import AddTextileButton from "../components/buttons/AddTextileButton";
import { TbTruckDelivery } from "react-icons/tb";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const TextileDetails = () => {
  const navigate = useNavigate();

  const handleManageSuppliersClick = () => {
    navigate("/suppliers"); // Navigate to the /suppliers route
  };

  return (
    <div>
      <div className="text-3xl font-bold">Textile Details</div>
      <div className="py-2 flex flex-row space-x-2">
        <AddTextileButton />
        <Button
          type="dashed"
          className="flex flex-row items-center space-x-1"
          onClick={handleManageSuppliersClick}
        >
          <TbTruckDelivery />
          Manage Suppliers
        </Button>
      </div>
      <TextileTable />
    </div>
  );
};

export default TextileDetails;

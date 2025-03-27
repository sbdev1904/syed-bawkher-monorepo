import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import fabricService from "../../services/fabricService";
import {
  InboxOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { IoMdBarcode } from "react-icons/io";
import { message, Upload, Modal, Button, Tooltip } from "antd";
import FabricImage from "./FabricImage";
import { useNavigate } from "react-router-dom";
import EditTextileModal from "../modals/EditTextileModal";
import Barcode from "react-barcode";

const FabricCard = ({ fabric }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [fabricData, setFabricData] = useState(fabric);
  const { confirm } = Modal;

  // Create the contentRef for react-to-print
  const contentRef = useRef(null);

  const fetchImageUrl = async () => {
    try {
      const result = await fabricService.getFabricImageUrl(
        fabricData.fabric_id
      );
      setImageUrl(result.url);
    } catch (error) {
      console.error("Error fetching fabric image URL:", error);
    }
  };

  useEffect(() => {
    if (fabricData.image) {
      fetchImageUrl();
    }
  }, [fabricData.image, fabricData.fabric_id]);

  const handleImageUploadSuccess = () => {
    fetchImageUrl();
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this Fabric?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: handleDelete,
    });
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await fabricService.deleteFabric(fabricData.fabric_id);
      message.success("Fabric deleted successfully.");
      navigate("/fabrics");
    } catch (error) {
      message.error("Failed to delete the fabric.");
    }
  };

  const handleFabricUpdate = (updatedFabric) => {
    setFabricData(updatedFabric);
  };

  // Print handler using contentRef
  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `@page { margin: 0; } body { display: flex; justify-content: center; align-items: center; height: 100vh; }`,
  });

  return (
    <div className="flex flex-row bg-white shadow-lg rounded-lg p-4 justify-between">
      <div className="flex flex-col">
        <div className="flex flex-row space-x-5">
          <div className="flex flex-col space-y-0 mb-2">
            <div className="text-lg font-bold">{fabricData.fabric_code}</div>
            <div className="text-sm font-extrabold text-gray-400">
              {fabricData.description}
            </div>
          </div>
          <div className="">
            <div className="flex flex-row space-x-2 items-center">
              <div onClick={() => setIsEditModalVisible(true)}>
                <Tooltip title="Edit Fabric">
                  <EditOutlined className="text-blue-500 hover:text-blue-300 transition-colors" />
                </Tooltip>
              </div>
              <div onClick={handlePrint}>
                <Tooltip title="Print Barcode">
                  <IoMdBarcode className="text-green-500 hover:text-green-300 transition-colors" />
                </Tooltip>
              </div>
              <div onClick={showDeleteConfirm}>
                <Tooltip title="Delete Fabric">
                  <DeleteOutlined className="text-red-500 hover:text-red-300 transition-colors" />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div className="text-md mb-2">
          <strong>ID:</strong> {fabricData.fabric_id}
        </div>
        <div className="text-md mb-2">
          <strong>Available Length:</strong> {fabricData.available_length}{" "}
          meters
        </div>
        <div className="text-md mb-2">
          <strong>Brand:</strong> {fabricData.fabric_brand}
        </div>
        <div className="text-md mb-2">
          <strong>Stock Location:</strong> {fabricData.stock_location}
        </div>
        <div className="text-md mb-2 flex flex-row">
          <div ref={contentRef}>
            <Barcode
              value={fabricData.fabric_id.toString()}
              width={2}
              height={40}
              fontSize={12}
              margin={0}
            />
            <div className="print-only hidden" style={{ display: "none" }}>
              Fabric: {fabricData.fabric_code}
            </div>
          </div>
        </div>
      </div>
      <div className="text-md mb-2">
        <FabricImage
          fabricId={fabricData.fabric_id}
          imageUrl={imageUrl}
          onImageUploadSuccess={handleImageUploadSuccess}
        />
      </div>
      <EditTextileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        fabric={fabricData}
        onUpdate={handleFabricUpdate}
      />
    </div>
  );
};

export default FabricCard;

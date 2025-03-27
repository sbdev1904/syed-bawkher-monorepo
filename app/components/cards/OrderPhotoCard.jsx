"use client";
import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message, Modal } from "antd";
import orderService from "../../services/orderService";
import axios from "axios";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const OrderPhotoCard = ({ orderNo }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    const fetchOrderPhotos = async () => {
      try {
        const photoUrls = await orderService.getOrderPhotos(orderNo);
        const formattedFileList = photoUrls.map((url, index) => ({
          uid: `order-photo-${index}`, // Ensure unique keys
          name: url.key,
          status: "done",
          url: url.url,
        }));
        setFileList(formattedFileList);
      } catch (error) {
        message.error("Failed to load order photos.");
      }
    };

    fetchOrderPhotos();
  }, [orderNo]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      const response = await orderService.getPresignedUrl(orderNo, file.name);
      const presignedUrl = response.url;

      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };

      // Upload the file in binary format
      await axios.put(presignedUrl, file, config);

      message.success(`${file.name} uploaded successfully.`);
      onSuccess("Ok"); // Antd expects this to mark the upload as done
      setFileList((prevList) => [
        ...prevList,
        {
          uid: `order-photo-${prevList.length + 1}`, // Ensure unique keys
          name: file.name,
          status: "done",
          url: presignedUrl.split("?")[0], // remove query params for the display URL
        },
      ]);
    } catch (error) {
      message.error(`${file.name} upload failed.`);
      onError(error);
    }
  };

  const showDeleteModal = (file) => {
    setFileToDelete(file);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      await orderService.deletePhoto(orderNo, fileToDelete.name);
      message.success(`${fileToDelete.name} deleted successfully.`);
      setFileList((prevList) =>
        prevList.filter((item) => item.uid !== fileToDelete.uid)
      );
      setDeleteModalVisible(false);
      setFileToDelete(null);
    } catch (error) {
      message.error(`Failed to delete ${fileToDelete.name}.`);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setFileToDelete(null);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-3 pb-4">
        <div>
          <h3 className="text-lg font-semibold pb-2 text-gray-700">
            Order Photos
          </h3>
        </div>
        <Upload
          customRequest={handleUpload}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          onRemove={showDeleteModal}
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>

      <Modal
        open={deleteModalVisible}
        title="Confirm Delete"
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText="Delete Photo"
        okType="danger"
        cancelText="Cancel"
      >
        <p className="py-2 text-gray-700 text-sm">
          Are you sure you want to delete this photo?
        </p>
        {fileToDelete && (
          <Image
            src={fileToDelete.url}
            style={{ width: "100%" }}
            className="rounded-lg shadow-lg"
            alt={fileToDelete.name}
          />
        )}
      </Modal>
    </>
  );
};

export default OrderPhotoCard;

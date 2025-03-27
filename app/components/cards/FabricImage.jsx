import React, { useState } from 'react';
import { InboxOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Upload, Modal, Button } from 'antd';
import fabricService from '../../services/fabricService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Dragger } = Upload;
const { confirm } = Modal;

const FabricImage = ({ fabricId, imageUrl, onImageUploadSuccess }) => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file upload with presigned URL
  const handleUpload = async ({ file, onSuccess, onError }) => {
    try {
      // Request presigned URL from the backend
      const response = await fabricService.getPresignedUrl(fabricId, file.name);
      const presignedUrl = response.url;

      const config = {
        headers: {
          "Content-Type": file.type,
        },
      };

      // Upload the file in binary format
      await axios.put(presignedUrl, file, config);

      message.success(`${file.name} uploaded successfully.`);
      onSuccess("Ok");

      // Update file list and refresh the image
      setFileList((prevList) => [
        ...prevList,
        {
          uid: `fabric-image-${prevList.length + 1}`, // Unique keys for the uploaded images
          name: file.name,
          status: 'done',
          url: presignedUrl.split('?')[0], // URL for displaying the image (without query params)
        },
      ]);

      // Notify parent of success (e.g., to refresh the displayed image)
      onImageUploadSuccess();
    } catch (error) {
      message.error(`${file.name} upload failed.`);
      onError(error);
    }
  };

  // Show a confirmation modal before deleting
  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete this image?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: handleDelete,
    });
  };

  // Handle image deletion
  const handleDelete = async () => {
    try {
      setLoading(true);
      await fabricService.deleteFabricImage(fabricId);
      message.success('Image deleted successfully.');
      setLoading(false);

      // Notify parent or refresh the component state
      onImageUploadSuccess();

    } catch (error) {
      message.error('Failed to delete the image.');
      setLoading(false);
    }
    //needs to refresh page to see the changes
  };

  return (
    <div>
      {!imageUrl && (
        <Dragger
          customRequest={handleUpload} // Use the custom request handler
          fileList={fileList}
          multiple={false} // Only allow single file upload
          onChange={({ fileList: newFileList }) => setFileList(newFileList)}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      )}

      {imageUrl && (
        <div style={{ position: 'relative' }}>
          <img
            src={imageUrl}
            alt="Fabric"
            className="w-[150px] h-auto mt-2"
          />
          <div onClick={showDeleteConfirm} className='absolute top-0 right-2'>
            <DeleteOutlined className='text-white hover:text-red-500 transition-colors'/>
          </div>
        </div>
      )}
    </div>
  );
};

export default FabricImage;

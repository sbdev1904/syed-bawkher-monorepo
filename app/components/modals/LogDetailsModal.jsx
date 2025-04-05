"use client";

import React from "react";
import { Modal, Descriptions, Tag } from "antd";

const LogDetailsModal = ({ isVisible, onClose, logData }) => {
  if (!logData) return null;

  const getTagColor = (type) => {
    switch (type.toLowerCase()) {
      case "order":
        return "blue";
      case "inventory":
        return "green";
      case "status":
        return "orange";
      default:
        return "default";
    }
  };

  return (
    <Modal
      title="Log Details"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Timestamp">
          {new Date(logData.timestamp).toLocaleString()}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={getTagColor(logData.type)}>{logData.type}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="User">{logData.user}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {logData.description}
        </Descriptions.Item>
        <Descriptions.Item label="Details">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(logData.details, null, 2)}
          </pre>
        </Descriptions.Item>
        {logData.relatedId && (
          <Descriptions.Item label="Related ID">{logData.relatedId}</Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default LogDetailsModal; 
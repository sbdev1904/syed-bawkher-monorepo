"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, List, message, Modal } from "antd";
import customerService from "../../services/customerService";

const MergeUserForm = ({ targetCustomerID = null }) => {
  const [targetUserId, setTargetUserId] = useState(targetCustomerID);
  const [otherUserIds, setOtherUserIds] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Update targetUserId when targetCustomerID prop changes
  useEffect(() => {
    setTargetUserId(targetCustomerID);
  }, [targetCustomerID]);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const results = await customerService.searchCustomers(query);
      setSearchResults(
        results.filter((customer) => customer.customer_id !== targetCustomerID)
      );
    } catch (error) {
      message.error("Error searching for customers");
      console.error("Error searching for customers:", error);
    }
  };

  const handleAddUserId = (user) => {
    const userId = user.customer_id;
    const userName = `${user.first_name} ${user.last_name}`;
    if (userId && !otherUserIds.some((u) => u.customer_id === userId)) {
      setOtherUserIds([
        ...otherUserIds,
        { customer_id: userId, full_name: userName },
      ]);
    }
  };

  const handleRemoveUserId = (userId) => {
    setOtherUserIds(otherUserIds.filter((user) => user.customer_id !== userId));
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchUserId(query);
    handleSearch(query);
  };

  const handleMerge = async () => {
    const customerIds = [
      targetUserId,
      ...otherUserIds.map((u) => u.customer_id),
    ];
    try {
      await customerService.mergeCustomers(customerIds);
      message.success("Customers merged successfully");
      window.location.reload();
    } catch (error) {
      message.error("Failed to merge customers");
      console.error("Error merging customers:", error);
    }
  };

  const showConfirm = () => {
    Modal.confirm({
      title: "Confirm Merge",
      content:
        "Are you sure you want to merge these users?, This action can not be undone.",
      onOk() {
        handleMerge();
      },
      onCancel() {
        console.log("Merge cancelled");
      },
    });
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Target User ID">
        <Input
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
          disabled={!!targetCustomerID} // Disable input if targetCustomerID is provided
        />
      </Form.Item>
      <Form.Item label="Search and Add User ID to Merge">
        <Input value={searchUserId} onChange={handleInputChange} />
        <List
          dataSource={searchResults}
          renderItem={(item) => (
            <List.Item onClick={() => handleAddUserId(item)}>
              {`${item.customer_id} - ${item.first_name} ${item.last_name}`}
            </List.Item>
          )}
        />
      </Form.Item>
      <Form.Item label="Users to Merge">
        <List
          dataSource={otherUserIds}
          renderItem={(item) => (
            <List.Item>
              {`${item.customer_id} - ${item.full_name}`}
              <Button
                type="link"
                onClick={() => handleRemoveUserId(item.customer_id)}
                style={{ marginLeft: "auto" }}
              >
                Remove
              </Button>
            </List.Item>
          )}
        />
      </Form.Item>
      <Button type="primary" onClick={showConfirm}>
        Merge Users
      </Button>
    </Form>
  );
};

export default MergeUserForm;

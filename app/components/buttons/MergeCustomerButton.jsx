import React, { useState } from "react";
import { Button, Tooltip } from "antd";
import MergeUserModal from "../modals/MergeUserModal";

const MergeCustomerButton = ({ customer_id = null }) => {
    const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);

    const handleMergeModal = () => {
        setIsMergeModalVisible(true);
    };

    const handleCancel = () => {
        setIsMergeModalVisible(false);
    };

    return (
        <>
            <Tooltip title="Merge Customers">
                <Button
                    type="primary"
                    onClick={() => {
                        console.log(`Merge customers ${customer_id}`);
                        handleMergeModal();
                    }}
                >
                    Merge Customers
                </Button>
            </Tooltip>
            <MergeUserModal 
                isOpen={isMergeModalVisible} 
                onCancel={handleCancel} 
                customer_id={customer_id} 
            />
        </>
    );
};

export default MergeCustomerButton;

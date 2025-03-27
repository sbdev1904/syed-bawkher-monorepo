import React, { useState } from "react";
import { Tooltip, Button } from 'antd';
import { IoMdCreate } from "react-icons/io";
import CreateOrderModal from "../modals/CreateOrderModal";
import { useNavigate } from "react-router-dom";

const CreateOrderButton = ({ customerId = null }) => {
    const [isCreateOrderModalVisible, setIsCreateOrderModalVisible] = useState(false);
    const navigate = useNavigate(); // Hook to get the navigate function

    const handleCreateOrder = () => {
        setIsCreateOrderModalVisible(true);
    };

    const handleCancel = () => {
        setIsCreateOrderModalVisible(false);
        //refresh page
        navigate(0)
    }

    return (
        <>
            <Tooltip title="Create Order">
                <Button
                    type="dashed"
                    shape="circle"
                    icon={<IoMdCreate />}
                    className="ml-2"
                    onClick={handleCreateOrder} // Attach the onClick event handler here
                />
            </Tooltip>
            {isCreateOrderModalVisible && (
                <CreateOrderModal
                    isOpen={isCreateOrderModalVisible}
                    isCancel={() => setIsCreateOrderModalVisible(false)}
                    customerid={customerId} // Pass customerId to the modal if needed
                />
            )}
        </>
    );
}

export default CreateOrderButton;

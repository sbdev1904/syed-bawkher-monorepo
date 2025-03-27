import React, { useState } from 'react';
import { Button, Tooltip } from 'antd';
import UpdateJacketMeasurementModal from '../modals/UpdateJacketMeasurementModal';
import UpdatePantMeasurementModal from '../modals/UpdatePantMeasurementModal';
import UpdateShirtMeasurementModal from '../modals/UpdateShirtMeasurementModal';

const EditMeasurementsButton = ({ measurementType, measurement }) => {
    const [isEditMeasurementModalVisible, setIsEditMeasurementModalVisible] = useState(false);

    const handleOpenModal = () => {
        setIsEditMeasurementModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsEditMeasurementModalVisible(false);
    };

    const renderModal = () => {
        switch (measurementType) {
            case 'jacket':
                return (
                    <UpdateJacketMeasurementModal
                        isOpen={isEditMeasurementModalVisible}
                        onCancel={handleCloseModal}
                        measurement={measurement}
                    />
                );
            case 'pant':
                return (
                    <UpdatePantMeasurementModal
                        isOpen={isEditMeasurementModalVisible}
                        onCancel={handleCloseModal}
                        measurement={measurement}
                    />
                );
            case 'shirt':
                return (
                    <UpdateShirtMeasurementModal
                        isOpen={isEditMeasurementModalVisible}
                        onCancel={handleCloseModal}
                        measurement={measurement}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className='w-full'>
            <Tooltip title="Edit Measurement">
                <Button className='w-full' type="dashed" onClick={handleOpenModal}>Edit</Button>
            </Tooltip>
            {renderModal()}
        </div>
    );
};

export default EditMeasurementsButton;

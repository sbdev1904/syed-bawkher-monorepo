"use client";
import React, { useEffect, useState } from "react";
import shirtService from '../../services/shirtService'
import { Table } from 'antd';
import moment from 'moment';

const ShirtMeasurements = ({customerId}) => {
    const [shirtData, setShirtData] = useState([]);

    useEffect(() => {
        const fetchShirtData = async () => {
            try {
                let data = await shirtService.getShirtByCustomerId(customerId);
                // Filter data to remove rows with all null measurements
                data = data.filter(entry => {
                    const { length, half_shoulder, to_sleeve, chest, waist, collar,  other_notes} = entry;
                    return [length, half_shoulder, to_sleeve, chest, waist, collar, other_notes].some(val => val !== null);
                  });
                setShirtData(data);
            } catch (error) {
                console.error('Failed to fetch shirt measurements:', error);
            }
        };

        if (customerId) {
            fetchShirtData();
        }
    }, [customerId]);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            fixed: 'left',
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
            sortDirections: ['descend', 'ascend'],
            render: text => moment(text).format('YYYY-MM-DD')
        },
        {
            title: 'Length',
            dataIndex: 'length',
            key: 'length',
            render: text => text || 'N/A'
        },
        {
            title: 'Half Shoulder',
            dataIndex: 'half_shoulder',
            key: 'half_shoulder',
            render: text => text || 'N/A'
        },
        {
            title: 'To Sleeve',
            dataIndex: 'to_sleeve',
            key: 'to_sleeve',
            render: text => text || 'N/A'
        },
        {
            title: 'Chest',
            dataIndex: 'chest',
            key: 'chest',
            render: text => text || 'N/A'
        },
        {
            title: 'Waist',
            dataIndex: 'waist',
            key: 'waist',
            render: text => text || 'N/A'
        },
        {
            title: 'Collar',
            dataIndex: 'collar',
            key: 'collar',
            render: text => text || 'N/A'
        },
        {
            title: 'Other Notes',
            dataIndex: 'other_notes',
            key: 'other_notes',
            fixed: 'right',
            render: text => text || 'N/A'
        }
    ]

  return (
    <>
        <h1 className="text-lg font-bold text-gray-600">Shirt</h1>
        <Table
            className='shadow-lg rounded-lg bg-slate-300'
            dataSource={shirtData}
            scroll={{
                x: 700,
              }}
            columns={columns}
            rowKey="measurement_id"
        />
    </>
  )
}

export default ShirtMeasurements
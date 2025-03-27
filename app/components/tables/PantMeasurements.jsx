import React, { useEffect, useState } from 'react';
import pantService from "../../services/pantService";
import { Table } from "antd";
import moment from 'moment';

const PantMeasurements = ({ customerId }) => {
    const [pantData, setPantData] = useState([]);

    useEffect(() => {
        const fetchPantData = async () => {
          try {
            let data = await pantService.getPantByCustomerId(customerId);
            // Filter data to remove rows with all null measurements
            data = data.filter(entry => {
                const { length, inseem, waist, hips, bottom, knee, other_notes} = entry;
                return [length, inseem, waist, hips, bottom, knee, other_notes].some(val => val !== null);
              });
            setPantData(data);
          } catch (error) {
            console.error('Failed to fetch pant measurements:', error);
          }
        };
    
        if (customerId) {
          fetchPantData();
        }
      }, [customerId]);
  
    const columns = [
      {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          fixed: 'left',
          sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),  // Sorting by Unix timestamp
          sortDirections: ['descend', 'ascend'],  // Default sorting directions
          render: text => moment(text).format('YYYY-MM-DD')
      },
      {
        title: 'Length',
        dataIndex: 'length',
        key: 'length',
        render: text => text || 'N/A',
      },
      {
        title: 'Inseem',
        dataIndex: 'inseem',
        key: 'inseem',
        render: text => text || 'N/A',
      },
      {
        title: 'Waist',
        dataIndex: 'waist',
        key: 'waist',
        render: text => text || 'N/A',
      },
      {
        title: 'Hips',
        dataIndex: 'hips',
        key: 'hips',
        render: text => text || 'N/A',
      },
      {
        title: 'Bottom',
        dataIndex: 'bottom',
        key: 'bottom',
        render: text => text || 'N/A',
      },
      {
        title: 'Knee',
        dataIndex: 'knee',
        key: 'knee',
        render: text => text || 'N/A',
      },
      {
        title: 'Other Notes',
        dataIndex: 'other_notes',
        key: 'other_notes',
        fixed: 'right',
        render: text => text || 'N/A',
      },
    ];

  return (
    <div>
      <h1 className="text-lg font-bold text-gray-600">Trouser</h1>
      <Table
        className='shadow-lg rounded-lg bg-slate-300'
        dataSource={pantData}
        columns={columns}
        scroll={{
          x: 700,
        }}
        rowKey="measurement_id"
      />
    </div>
  );
};

export default PantMeasurements;

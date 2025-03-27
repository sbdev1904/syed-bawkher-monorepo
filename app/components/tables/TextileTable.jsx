import React, { useState, useEffect } from 'react';
import { Table, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import fabricService from '../../services/fabricService';

const TextileTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const fabrics = await fabricService.getAllFabrics();
      setData(fabrics.map((fabric, index) => ({ ...fabric, key: index.toString() })));
    } catch (error) {
      console.error('Failed to fetch fabrics:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleView = (fabricId) => {
    navigate(`/fabric/${fabricId}`);
  };

  const handleSearch = async (value) => {
    setSearchLoading(true);
    if (value) {
      try {
        const results = await fabricService.searchFabrics(value);
        setData(results.map((fabric, index) => ({ ...fabric, key: index.toString() })));
      } catch (error) {
        console.error('Failed to search fabrics:', error);
      }
    } else {
      // If search query is empty, fetch all fabrics
      await fetchData();
    }
    setSearchLoading(false);
  };

  const columns = [
    {
      title: 'Fabric Id',
      dataIndex: 'fabric_id',
    },
    {
      title: 'Fabric Code',
      dataIndex: 'fabric_code',
      fixed: 'left',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Available Length',
      dataIndex: 'available_length',
    },
    {
      title: 'Brand',
      dataIndex: 'fabric_brand',
    },
    {
      title: 'Stock Location',
      dataIndex: 'stock_location',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      fixed: 'right',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleView(record.fabric_id)}>
            View
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Search fabrics"
        enterButton
        onSearch={handleSearch}
        style={{ marginBottom: 16, width: '100%' }}
      />
      <Table
        bordered
        className="bg-white rounded-lg shadow-lg"
        scroll={{ x: 1300 }}
        dataSource={data}
        columns={columns}
        rowClassName="editable-row"
        loading={loading || searchLoading}
      />
    </div>
  );
};

export default TextileTable;

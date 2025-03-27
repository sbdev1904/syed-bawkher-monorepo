import React, { useEffect, useState } from 'react';
import { Table, message, Button, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import supplierService from '../../services/supplierService';

const SupplierListTable = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const supplierList = await supplierService.getAllSuppliers();
        setSuppliers(supplierList);
        setLoading(false);
      } catch (error) {
        message.error('Failed to load suppliers: ' + error.message);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (supplierId) => {
    try {
      await supplierService.deleteSupplier(supplierId);
      message.success('Supplier deleted successfully');
      setSuppliers(suppliers.filter(supplier => supplier.supplier_id !== supplierId)); // Remove the deleted supplier from the list
    } catch (error) {
      message.error('Failed to delete supplier: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Supplier Name',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    },
    {
      title: 'Address 1',
      dataIndex: 'add1',
      key: 'add1',
    },
    {
      title: 'Address 2',
      dataIndex: 'add2',
      key: 'add2',
    },
    {
      title: 'Address 3',
      dataIndex: 'add3',
      key: 'add3',
    },
    {
      title: 'Phone Number 1',
      dataIndex: 'phone_number1',
      key: 'phone_number1',
    },
    {
      title: 'Phone Number 2',
      dataIndex: 'phone_number2',
      key: 'phone_number2',
    },
    {
      title: 'Phone Number 3',
      dataIndex: 'phone_number3',
      key: 'phone_number3',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Contact Name 1',
      dataIndex: 'primary_contact_name1',
      key: 'primary_contact_name1',
    },
    {
      title: 'Contact Name 2',
      dataIndex: 'primary_contact_name2',
      key: 'primary_contact_name2',
    },
    {
      title: 'Contact Name 3',
      dataIndex: 'primary_contact_name3',
      key: 'primary_contact_name3',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button type="text" className='text-blue-600' onClick={() => navigate(`/supplier/${record.supplier_id}`)}>View</Button>
          <Popconfirm
            title={`Are you sure you want to delete "${record.supplier_name}" from the supplier list?`}
            onConfirm={() => handleDelete(record.supplier_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" className='text-red-600'>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      className="bg-white rounded-lg shadow-lg"
      columns={columns}
      dataSource={suppliers}
      rowKey="supplier_id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default SupplierListTable;

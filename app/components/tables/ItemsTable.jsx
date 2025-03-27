import React, { useEffect, useState } from "react";
import itemsService from "../../services/itemsService";
import { Table, Spin, Alert } from "antd";
import AddItemsButton from "../buttons/AddItemsButton";

const ItemsTable = ({ orderNo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await itemsService.getOrderItems(orderNo);
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderNo]);

  const columns = [
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
    },
    {
      title: "Item Type",
      dataIndex: "item_type",
      key: "item_type",
    },
    {
      title: "Fabric ID",
      dataIndex: "fabric_id",
      key: "fabric_id",
    },
    {
      title: "Lining ID",
      dataIndex: "lining_fabric_id",
      key: "lining_fabric_id",
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <span>
                <a href={``} className='text-blue-600'>View</a>
            </span>
        ),
    }
    // Add more columns as needed
  ];

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load items."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="items-table">
      <Table columns={columns} dataSource={data} rowKey={(record) => record.item_id} className="bg-slate-100 rounded-lg" footer={() => {
        return (
          <div>
            <AddItemsButton orderNo={orderNo} />
          </div>
        );
      }}/>
    </div>
  );
};

export default ItemsTable;

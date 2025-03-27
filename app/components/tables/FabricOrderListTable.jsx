import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import fabricOrderService from "../../services/fabricOrderListService";
import AddFabricPurchaseOrderButton from "../buttons/AddFabricPurchaseOrderButton";
import moment from "moment";

const FabricOrderListTable = ({ fabricId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    console.log("Fabric ID:", fabricId); // Log the fabric ID
    const fetchOrders = async () => {
      try {
        const data = await fabricOrderService.getFabricOrdersByFabricCode(
          fabricId
        );
        console.log("Fetched Orders:", data); // Log the fetched orders
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch fabric orders:", error);
      }
    };

    if (fabricId) {
      fetchOrders();
    }
  }, [fabricId]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplier_name",
      key: "supplier_name",
    },
    {
      title: "Meters",
      dataIndex: "meters",
      key: "meters",
    },
    {
      title: "Ordered Date",
      dataIndex: "ordered_date",
      key: "ordered_date",
      render: (text) => moment(text).format("MMM D, YYYY"),
    },
    {
      title: "Ordered For",
      dataIndex: "ordered_for",
      key: "ordered_for",
    },
  ];

  return (
    <>
      <div>
        <AddFabricPurchaseOrderButton fabricId={fabricId}/>
      </div>
      <div className="py-2">
        <Table
          className="shadow-lg bg-white rounded-lg"
          dataSource={orders}
          columns={columns}
          rowKey="order_id"
        />
      </div>
    </>
  );
};

export default FabricOrderListTable;

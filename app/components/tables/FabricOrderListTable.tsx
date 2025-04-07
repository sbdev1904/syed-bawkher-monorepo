"use client";
import React, { useEffect, useState } from "react";
import fabricOrderService from "../../services/fabricOrderListService";
import AddFabricPurchaseOrderButton from "../buttons/AddFabricPurchaseOrderButton";
import moment from "moment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FabricOrder {
  order_id: string;
  description: string;
  supplier_name: string;
  meters: number;
  ordered_date: string;
  ordered_for: string;
}

const FabricOrderListTable = ({ fabricId }: { fabricId: string }) => {
  const [orders, setOrders] = useState<FabricOrder[]>([]);

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

  return (
    <>
      <div>
        <AddFabricPurchaseOrderButton fabricId={fabricId} />
      </div>
      <div className="py-2">
        <Table className="shadow-lg bg-white rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Supplier Name</TableHead>
              <TableHead>Meters</TableHead>
              <TableHead>Ordered Date</TableHead>
              <TableHead>Ordered For</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell>{order.supplier_name}</TableCell>
                <TableCell>{order.meters}</TableCell>
                <TableCell>{moment(order.ordered_date).format("MMM D, YYYY")}</TableCell>
                <TableCell>{order.ordered_for}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default FabricOrderListTable;

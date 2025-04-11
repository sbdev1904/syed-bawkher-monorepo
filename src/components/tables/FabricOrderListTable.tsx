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
        <Table className="shadow-lg bg-slate-800 rounded-lg">
          <TableHeader>
            <TableRow className="border-b border-slate-600">
              <TableHead className="text-slate-200">Order ID</TableHead>
              <TableHead className="text-slate-200">Description</TableHead>
              <TableHead className="text-slate-200">Supplier Name</TableHead>
              <TableHead className="text-slate-200">Meters</TableHead>
              <TableHead className="text-slate-200">Ordered Date</TableHead>
              <TableHead className="text-slate-200">Ordered For</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.order_id}
                className="border-b border-slate-600 hover:bg-slate-700"
              >
                <TableCell className="text-slate-300">{order.order_id}</TableCell>
                <TableCell className="text-slate-300">{order.description}</TableCell>
                <TableCell className="text-slate-300">{order.supplier_name}</TableCell>
                <TableCell className="text-slate-300">{order.meters}</TableCell>
                <TableCell className="text-slate-300">{moment(order.ordered_date).format("MMM D, YYYY")}</TableCell>
                <TableCell className="text-slate-300">{order.ordered_for}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default FabricOrderListTable;

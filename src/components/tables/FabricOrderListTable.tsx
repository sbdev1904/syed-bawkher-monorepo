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
  fabric_id: number;
  supplier_id: number;
  order_id: string;
  description: string;
  supplier_name: string;
  meters: number;
  ordered_date: string;
  ordered_for: string;
}

const FabricOrderListTable = ({ fabricId }: { fabricId: number }) => {
  const [orders, setOrders] = useState<FabricOrder[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fabricOrderService.getFabricOrdersByFabricCode(fabricId);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch fabric orders:", error);
        setError("Failed to fetch fabric orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (fabricId) {
      fetchOrders();
    }
  }, [fabricId]);

  if (loading) {
    return <div className="text-slate-300">Loading orders...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <>
      <div>
        <AddFabricPurchaseOrderButton fabricId={fabricId} />
      </div>
      <div className="py-2">
        {orders.length > 0 ? (
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
                  <TableCell className="text-slate-300">
                    {order.order_id}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {order.description}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {order.supplier_name}
                  </TableCell>
                  <TableCell className="text-slate-300">{order.meters}</TableCell>
                  <TableCell className="text-slate-300">
                    {moment(order.ordered_date).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {order.ordered_for}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-slate-300">No orders found for this fabric.</p>
        )}
      </div>
    </>
  );
};

export default FabricOrderListTable;

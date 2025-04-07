"use client";
import React, { useEffect, useState } from "react";
import itemsService from "../../services/itemsService";
import AddItemsButton from "../buttons/AddItemsButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Item {
  item_id: string;
  item_name: string;
  item_type: string;
  fabric_id: string;
  lining_fabric_id: string;
}

const ItemsTable = ({ orderNo }: { orderNo: string }) => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await itemsService.getOrderItems(orderNo);
        setData(result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderNo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load items.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="items-table">
      <Table className="bg-slate-100 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Item Type</TableHead>
            <TableHead>Fabric ID</TableHead>
            <TableHead>Lining ID</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.item_id}>
              <TableCell>{item.item_name}</TableCell>
              <TableCell>{item.item_type}</TableCell>
              <TableCell>{item.fabric_id}</TableCell>
              <TableCell>{item.lining_fabric_id}</TableCell>
              <TableCell>
                <Button variant="link" className="text-blue-600 p-0">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <tfoot>
          <tr>
            <td colSpan={5}>
              <AddItemsButton orderNo={orderNo} />
            </td>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
};

export default ItemsTable;

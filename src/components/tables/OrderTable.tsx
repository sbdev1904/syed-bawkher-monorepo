"use client";
import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";
import moment from "moment";
import CreateOrderButton from "../buttons/CreateOrderButton";
import { Search as SearchIcon, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface Order {
  orderNo: string;
  date: string;
  onote: string | null;
}

const OrderTable = ({ customerId }: { customerId: string }) => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[] | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOrders = await orderService.findByCustomerId(customerId);
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    };

    fetchData();
  }, [customerId]);

  useEffect(() => {
    if (orders && searchText) {
      setFilteredOrders(
        orders.filter((order) =>
          order.orderNo.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFilteredOrders(orders);
    }
  }, [searchText, orders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const confirmDelete = (orderNo: string) => {
    setOrderToDelete(orderNo);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;

    try {
      await orderService.deleteOrder(orderToDelete);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
      setOrders(orders?.filter((order) => order.orderNo !== orderToDelete) || null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
      console.error("Error deleting order:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const EmptyState = () => (
    <div className="text-center py-10 px-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4">
        <Package className="h-6 w-6 text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">No orders found</h3>
      <p className="text-sm text-slate-500 mb-6">
        {searchText
          ? "No orders match your search criteria. Try a different search term."
          : "Get started by creating your first order."}
      </p>
      <CreateOrderButton customerId={customerId} />
    </div>
  );

  if (!orders) {
    return (
      <div className="pt-2">
        <div className="flex items-center justify-center h-32">
          <div className="animate-pulse flex space-x-4">
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
            <div className="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2">
      <h1 className="py-2 text-lg font-light">Orders</h1>

      <div className="mb-4">
        <div className="relative">
          <Input
            className="pl-8"
            placeholder="Search order number"
            value={searchText}
            onChange={handleSearch}
          />
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="shadow-lg rounded-lg bg-slate-300 min-w-[500px]">
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders?.length ? (
              filteredOrders.map((order) => (
                <TableRow key={order.orderNo}>
                  <TableCell>{order.orderNo}</TableCell>
                  <TableCell>{moment(order.date).format("YYYY-MM-DD")}</TableCell>
                  <TableCell>{order.onote || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="link"
                        className="text-blue-600 p-0"
                        asChild
                      >
                        <a href={`/order/${encodeURIComponent(order.orderNo)}`}>
                          View Order
                        </a>
                      </Button>
                      <Button
                        variant="link"
                        className="text-red-600 p-0"
                        onClick={() => confirmDelete(order.orderNo)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {filteredOrders && filteredOrders.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4} className="p-4">
                  <CreateOrderButton customerId={customerId} />
                </td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Deleting order {orderToDelete}, will permanently remove it and its associated Measurements and Items from the database. This can not be undone!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTable;

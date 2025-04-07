"use client";

import React from "react";
import {
  User,
  ShoppingCart,
  Scissors,
  Package,
  Clock,
} from "lucide-react";
import DashboardLayout from "./components/layout/DashboardLayout";
import CreateCustomerButton from "@/app/components/buttons/CreateCustomerButton";
import CreateOrderButton from "@/app/components/buttons/CreateOrderButton";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentOrder {
  key: string;
  orderNo: string;
  customer: string;
  items: string[];
  status: string;
}

export default function Home() {
  const router = useRouter();

  // Mock data for recent orders
  const recentOrders: RecentOrder[] = [
    {
      key: "1",
      orderNo: "ORD001",
      customer: "John Doe",
      items: ["Suit", "Shirt"],
      status: "In Production",
    },
    {
      key: "2",
      orderNo: "ORD002",
      customer: "Jane Smith",
      items: ["Dress", "Pants"],
      status: "Pending",
    },
    {
      key: "3",
      orderNo: "ORD003",
      customer: "Mike Johnson",
      items: ["Jacket"],
      status: "Ready for Delivery",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Production":
        return "bg-blue-500";
      case "Pending":
        return "bg-yellow-500";
      case "Ready for Delivery":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="space-x-4">
            <CreateCustomerButton />
            <CreateOrderButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total Customers</div>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Active Orders</div>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">In Production</div>
              <Scissors className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Low Stock Items</div>
              <Package className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 lg:col-span-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <h3 className="text-lg font-medium">Recent Orders</h3>
                <Button variant="link" onClick={() => router.push('/orders')}>View All</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order No</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.key}>
                        <TableCell>
                          <Button
                            variant="link"
                            onClick={() => router.push(`/order/${order.orderNo}`)}
                          >
                            {order.orderNo}
                          </Button>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {order.items.map((item) => (
                              <Badge key={item} variant="secondary">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-white ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <h3 className="text-lg font-medium">Upcoming Deliveries</h3>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <span>ORD001 - John Doe</span>
                    <Badge variant="secondary">Today</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>ORD005 - Alice Brown</span>
                    <Badge variant="secondary">Tomorrow</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>ORD008 - Bob Wilson</span>
                    <Badge variant="secondary">In 2 days</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

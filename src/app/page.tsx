"use client";

import React, { useEffect } from "react";
import {
  User,
  ShoppingCart,
  Scissors,
  Package,
  Clock,
  Sun,
  Moon,
  Sunrise,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateCustomerButton from "@/components/buttons/CreateCustomerButton";
import CreateOrderButton from "@/components/buttons/CreateOrderButton";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface RecentOrder {
  key: string;
  orderNo: string;
  customer: string;
  items: string[];
  status: string;
}

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sunrise };
    if (hour < 18) return { text: "Good afternoon", icon: Sun };
    return { text: "Good evening", icon: Moon };
  };

  const { text: greeting, icon: GreetingIcon } = getGreeting();

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "In Production":
        return "badge-blue";
      case "Pending":
        return "badge-yellow";
      case "Ready for Delivery":
        return "badge-green";
      default:
        return "badge-gray";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl text-slate-100 font-bold">Dashboard Overview</h1>
            <div className="flex flex-col gap-1">
              <div className="flex items-center text-slate-300">
                <GreetingIcon className="h-4 w-4 mr-2" />
                <span className="text-lg">{greeting}, {session.user.username}!</span>
              </div>
              <p className="text-slate-400 text-sm ml-6">What are we doing today?</p>
              <div className="flex items-center ml-6 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {session.user.role.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>
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
                          <Badge className={cn(getStatusBadgeClass(order.status))}>
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

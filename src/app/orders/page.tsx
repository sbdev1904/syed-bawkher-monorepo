"use client";

import React, { useState } from "react";
import {
    ShoppingCart,
    Clock,
    CheckCircle,
    Search,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateOrderButton from "@/components/buttons/CreateOrderButton";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Order {
    orderNo: string;
    customer: string;
    items: string[];
    status: "In Production" | "Pending" | "Ready for Delivery";
    dueDate: string;
    priority: "high" | "medium" | "low";
}

export default function OrdersPage() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [date, setDate] = useState<Date>();

    // Mock data for orders
    const orders: Order[] = [
        {
            orderNo: "ORD001",
            customer: "John Doe",
            items: ["Suit", "Shirt"],
            status: "In Production",
            dueDate: "2024-04-15",
            priority: "high",
        },
        {
            orderNo: "ORD002",
            customer: "Jane Smith",
            items: ["Dress", "Pants"],
            status: "Pending",
            dueDate: "2024-04-20",
            priority: "medium",
        },
        {
            orderNo: "ORD003",
            customer: "Mike Johnson",
            items: ["Jacket"],
            status: "Ready for Delivery",
            dueDate: "2024-04-10",
            priority: "low",
        },
    ];

    const getStatusColor = (status: Order["status"]) => {
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

    const getPriorityColor = (priority: Order["priority"]) => {
        switch (priority) {
            case "high":
                return "bg-red-500";
            case "medium":
                return "bg-yellow-500";
            case "low":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Orders Management</h1>
                    <CreateOrderButton />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Total Orders</div>
                            <ShoppingCart className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">156</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">In Production</div>
                            <Clock className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">28</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Pending</div>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">15</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Completed</div>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">113</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <div className="mb-4 flex space-x-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order No</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Priority</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.orderNo}>
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
                                            <Badge className={cn("text-white", getStatusColor(order.status))}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(order.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge className={cn("text-white", getPriorityColor(order.priority))}>
                                                {order.priority.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
} 
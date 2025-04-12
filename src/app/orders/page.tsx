"use client";

import React, { useState, useEffect } from "react";
import {
    ShoppingCart,
    Clock,
    CheckCircle,
    Search,
    Loader2,
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
    customer: {
        customer_id: number;
        first_name: string | null;
        last_name: string | null;
    } | null;
    items: {
        item_id: number;
        item_name: string | null;
        item_type: "SHIRT" | "JACKET" | "PANT" | null;
    }[];
    date: string | null;
}

interface OrderStats {
    total: number;
    inProduction: number;
    pending: number;
    completed: number;
}

export default function OrdersPage() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [date, setDate] = useState<Date>();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<OrderStats>({
        total: 0,
        inProduction: 0,
        pending: 0,
        completed: 0,
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/orders');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            setOrders(data);
            calculateStats(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (ordersData: Order[]) => {
        setStats({
            total: ordersData.length,
            inProduction: ordersData.filter(order => order.items.some(item => item.item_type === "SHIRT" || item.item_type === "JACKET")).length,
            pending: ordersData.filter(order => !order.items.length).length,
            completed: ordersData.filter(order => order.items.every(item => item.item_type)).length,
        });
    };

    // Filter orders based on search text and selected date
    const filteredOrders = orders.filter(order => {
        const searchMatch = searchText.toLowerCase() === '' ||
            order.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
            order.customer?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
            order.customer?.last_name?.toLowerCase().includes(searchText.toLowerCase());

        const dateMatch = !date || new Date(order.date || '').toDateString() === date.toDateString();

        return searchMatch && dateMatch;
    });

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </DashboardLayout>
        );
    }

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
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">In Production</div>
                            <Clock className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.inProduction}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Pending</div>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Completed</div>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed}</div>
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
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order No</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.orderNo}>
                                            <TableCell>
                                                <Button
                                                    variant="link"
                                                    onClick={() => router.push(`/order/${order.orderNo}`)}
                                                >
                                                    {order.orderNo}
                                                </Button>
                                            </TableCell>
                                            <TableCell>
                                                {order.customer ?
                                                    `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() :
                                                    'N/A'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {order.items.map((item) => (
                                                        <Badge key={item.item_id} variant="secondary">
                                                            {item.item_name || item.item_type || 'Unknown'}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
} 
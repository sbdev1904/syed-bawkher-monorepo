"use client";

import React from "react";
import { User, Phone } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FindCustomer from "@/components/search/FindCustomer";
import FindCustomerByOrderNo from "@/components/search/FindCustomerByOrderNo";
import CreateCustomerButton from "@/components/buttons/CreateCustomerButton";
import { CustomerTable } from "@/components/tables/CustomerTable";

export default function CustomersPage() {
    const [stats, setStats] = React.useState({
        totalCustomers: 0,
        newCustomersThisMonth: 0,
        activeOrders: 0,
    });
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/customers/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Customer Management</h1>
                    <CreateCustomerButton />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Total Customers</div>
                            <User className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? (
                                    <span className="text-muted-foreground">Loading...</span>
                                ) : (
                                    stats.totalCustomers
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">New This Month</div>
                            <User className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? (
                                    <span className="text-muted-foreground">Loading...</span>
                                ) : (
                                    stats.newCustomersThisMonth
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Active Orders</div>
                            <Phone className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {isLoading ? (
                                    <span className="text-muted-foreground">Loading...</span>
                                ) : (
                                    stats.activeOrders
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Search by Name/Phone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FindCustomer />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Search by Order Number</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FindCustomerByOrderNo />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomerTable />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
} 
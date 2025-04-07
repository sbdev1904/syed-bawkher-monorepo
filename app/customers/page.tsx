"use client";

import React from "react";
import { User, Phone } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FindCustomer from "@/app/components/search/FindCustomer";
import FindCustomerByOrderNo from "@/app/components/search/FindCustomerByOrderNo";
import CreateCustomerButton from "@/app/components/buttons/CreateCustomerButton";

export default function CustomersPage() {
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
                            <div className="text-2xl font-bold">156</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">New This Month</div>
                            <User className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">24</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="text-sm font-medium">Active Orders</div>
                            <Phone className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
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
            </div>
        </DashboardLayout>
    );
} 
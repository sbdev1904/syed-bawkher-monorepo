"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string;
}

interface SelectCustomerFormProps {
    onSelect: (customerId: string) => void;
    selectedCustomerId?: string;
}

const SelectCustomerForm: React.FC<SelectCustomerFormProps> = ({
    onSelect,
    selectedCustomerId,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    React.useEffect(() => {
        const fetchCustomers = async () => {
            if (!debouncedSearch) {
                setCustomers([]);
                return;
            }

            setIsLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `/api/customers?search=${encodeURIComponent(debouncedSearch)}&pageSize=10`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch customers");
                }

                setCustomers(data.customers);
            } catch (err) {
                setError("Failed to fetch customers");
                console.error("Error fetching customers:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCustomers();
    }, [debouncedSearch]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search customers by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />
                {isLoading && (
                    <div className="absolute right-2 top-2">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {!searchTerm && (
                <p className="text-sm text-gray-500 text-center py-4">
                    Start typing to search for customers
                </p>
            )}

            {searchTerm && !isLoading && customers.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                    No customers found
                </p>
            )}

            {customers.length > 0 && (
                <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                        {customers.map((customer) => (
                            <div
                                key={customer.id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedCustomerId === customer.id
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                    }`}
                                onClick={() => onSelect(customer.id)}
                            >
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-sm opacity-90">
                                    {customer.phone && (
                                        <span className="mr-2">📱 {customer.phone}</span>
                                    )}
                                    {customer.email && <span>✉️ {customer.email}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};

export default SelectCustomerForm; 
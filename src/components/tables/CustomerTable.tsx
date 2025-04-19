import React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState,
    Column,
    Header,
    HeaderGroup,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface Customer {
    id: string;
    name: string;
    phone: string;
    email: string;
    totalOrders: number;
    lastOrder: string;
}

const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: ({ column }: { column: Column<Customer> }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "totalOrders",
        header: ({ column }: { column: Column<Customer> }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Total Orders
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "lastOrder",
        header: ({ column }: { column: Column<Customer> }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Order
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
];

export function CustomerTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize] = React.useState(10);
    const [data, setData] = React.useState<{
        customers: Customer[];
        totalPages: number;
        currentPage: number;
        totalCount: number;
    }>({
        customers: [],
        totalPages: 0,
        currentPage: 1,
        totalCount: 0,
    });
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchCustomers = React.useCallback(async () => {
        try {
            setIsLoading(true);
            const sortField = sorting.length > 0 ? sorting[0].id : "customer_id";
            const sortOrder = sorting.length > 0 ? sorting[0].desc ? "desc" : "asc" : "asc";

            const response = await fetch(
                `/api/customers?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortField}&sortOrder=${sortOrder}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch customers");
            }

            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, sorting]);

    React.useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const table = useReactTable({
        data: data.customers,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
        manualPagination: true,
        pageCount: data.totalPages,
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<Customer>) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header: Header<Customer, unknown>) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Loading customers...
                                </TableCell>
                            </TableRow>
                        ) : data.customers.length ? (
                            data.customers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell>{customer.name}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.totalOrders}</TableCell>
                                    <TableCell>{customer.lastOrder}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * pageSize) + 1} to{" "}
                    {Math.min(currentPage * pageSize, data.totalCount)} of{" "}
                    {data.totalCount} customers
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(data.totalPages, prev + 1))}
                        disabled={currentPage >= data.totalPages || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
} 
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from '@/app/auth';
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Scissors,
    Package,
    Bell,
    User,
    Settings,
    LogOut
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const router = useRouter();

    const menuItems = [
        {
            key: '/',
            icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            label: <Link href="/">Dashboard</Link>,
        },
        {
            key: '/customers',
            icon: <Users className="mr-2 h-4 w-4" />,
            label: <Link href="/customers">Customers</Link>,
        },
        {
            key: '/orders',
            icon: <ShoppingCart className="mr-2 h-4 w-4" />,
            label: <Link href="/orders">Orders</Link>,
        },
        {
            key: '/production',
            icon: <Scissors className="mr-2 h-4 w-4" />,
            label: <Link href="/production">Production</Link>,
        },
        {
            key: '/inventory',
            icon: <Package className="mr-2 h-4 w-4" />,
            label: <Link href="/inventory">Inventory</Link>,
        },
        {
            key: '/textiles',
            icon: <Package className="mr-2 h-4 w-4" />,
            label: <Link href="/textiles">Textiles</Link>,
        },
        {
            key: '/suppliers',
            icon: <Users className="mr-2 h-4 w-4" />,
            label: <Link href="/suppliers">Suppliers</Link>,
        },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm z-10">
                <div className="p-4">
                    <h1 className="text-xl font-bold">Tailor Admin</h1>
                </div>
                <nav className="space-y-1 px-2">
                    {menuItems.map((item) => (
                        <Link
                            href={item.key}
                            key={item.key}
                            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="bg-white border-b shadow-sm h-14 flex items-center justify-end px-6">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar>
                                        <AvatarImage src="" alt="User" />
                                        <AvatarFallback>
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <LogoutButton />
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <div className="p-6 min-h-[360px] bg-white rounded-lg shadow-sm">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 
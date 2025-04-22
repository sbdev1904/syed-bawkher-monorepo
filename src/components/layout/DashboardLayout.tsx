import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Image from 'next/image';

import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Scissors,
    Package,
    Bell,
    User,
    Settings,
    LogOut, UserCog, Truck
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
    const pathname = usePathname();

    const menuItems = [
        {
            path: '/',
            icon: <LayoutDashboard className="h-5 w-5" />,
            label: 'Dashboard',
        },
        {
            path: '/customers',
            icon: <Users className="h-5 w-5" />,
            label: 'Customers',
        },
        {
            path: '/orders',
            icon: <ShoppingCart className="h-5 w-5" />,
            label: 'Orders',
        },
        {
            path: '/production',
            icon: <Scissors className="h-5 w-5" />,
            label: 'Production',
        },
        {
            path: '/inventory',
            icon: <Truck className="h-5 w-5" />,
            label: 'Inventory',
        },
        {
            path: '/textiles',
            icon: <Package className="h-5 w-5" />,
            label: 'Textiles',
        },
        {
            path: '/suppliers',
            icon: <Users className="h-5 w-5" />,
            label: 'Suppliers',
        },
        {
            path: '/tailors',
            icon: <UserCog className="h-5 w-5" />,
            label: 'Tailors',
        },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-slate-300 border-r shadow-sm z-10">
                <div className="p-4">
                    <div className="w-full h-24 overflow-hidden">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={500}
                            height={500}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-xl text-slate-900 font-bold mt-3">Admin</h1>
                </div>
                <nav className="space-y-1 px-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                href={item.path}
                                key={item.path}
                                className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-slate-900 text-slate-100"
                                        : "text-slate-900 hover:bg-slate-500 hover:text-slate-100"
                                )}
                            >
                                <span className={cn("mr-2", isActive ? "text-slate-400" : "text-slate-900")}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Header */}
                <header className="bg-slate-900 border-b shadow-sm h-14 flex items-center justify-end px-6">
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
                            <DropdownMenuContent>
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
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <div className="p-6 min-h-[360px] bg-slate-700 rounded-lg shadow-sm">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 
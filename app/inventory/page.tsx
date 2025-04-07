"use client";

import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  ShoppingBag,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  category: "fabric" | "accessory" | "packaging";
  type: string;
  color?: string;
  supplier: string;
  stockLevel: number;
  minStockLevel: number;
  reorderPoint: number;
  unitPrice: number;
  location: string;
  lastRestocked: string;
}

export default function InventoryPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>();

  // Mock data for inventory items
  const inventoryItems: InventoryItem[] = [
    {
      id: "FAB001",
      name: "Premium Wool",
      category: "fabric",
      type: "Wool",
      color: "Navy",
      supplier: "WoolCo Ltd",
      stockLevel: 150,
      minStockLevel: 100,
      reorderPoint: 120,
      unitPrice: 45.99,
      location: "A-12",
      lastRestocked: "2024-03-20",
    },
    {
      id: "FAB002",
      name: "Cotton Shirting",
      category: "fabric",
      type: "Cotton",
      color: "White",
      supplier: "TextilePro",
      stockLevel: 80,
      minStockLevel: 100,
      reorderPoint: 120,
      unitPrice: 15.99,
      location: "B-03",
      lastRestocked: "2024-03-15",
    },
    {
      id: "ACC001",
      name: "Buttons",
      category: "accessory",
      type: "Button",
      color: "Gold",
      supplier: "AccessoryCo",
      stockLevel: 1000,
      minStockLevel: 500,
      reorderPoint: 750,
      unitPrice: 0.50,
      location: "C-15",
      lastRestocked: "2024-03-25",
    },
    {
      id: "PKG001",
      name: "Suit Bags",
      category: "packaging",
      type: "Bag",
      supplier: "PackagingPro",
      stockLevel: 200,
      minStockLevel: 150,
      reorderPoint: 175,
      unitPrice: 2.99,
      location: "D-01",
      lastRestocked: "2024-03-18",
    },
  ];

  const getStockStatus = (item: InventoryItem) => {
    if (item.stockLevel <= item.minStockLevel) return "destructive";
    if (item.stockLevel <= item.reorderPoint) return "warning";
    return "default";
  };

  const getCategoryColor = (category: InventoryItem["category"]) => {
    switch (category) {
      case "fabric":
        return "bg-blue-500";
      case "accessory":
        return "bg-green-500";
      case "packaging":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Stock
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total Items</div>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Low Stock Items</div>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventoryItems.filter((item) => item.stockLevel <= item.minStockLevel).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Need Reorder</div>
              <ShoppingBag className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventoryItems.filter(
                  (item) =>
                    item.stockLevel > item.minStockLevel && item.stockLevel <= item.reorderPoint
                ).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="text-sm font-medium">Total Value</div>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${inventoryItems
                  .reduce((sum, item) => sum + item.stockLevel * item.unitPrice, 0)
                  .toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4 flex space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fabric">Fabric</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="packaging">Packaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Last Restocked</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge className={cn("text-white", getCategoryColor(item.category))}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      {item.color && (
                        <Badge variant="outline">{item.color}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-[200px]">
                              <Progress
                                value={(item.stockLevel / item.reorderPoint) * 100}
                                className={cn(
                                  getStockStatus(item) === "destructive" && "text-red-500",
                                  getStockStatus(item) === "warning" && "text-yellow-500"
                                )}
                              />
                              <div className="text-xs text-muted-foreground mt-1">
                                {item.stockLevel} / {item.reorderPoint}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Min: {item.minStockLevel}</p>
                            <p>Reorder: {item.reorderPoint}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
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

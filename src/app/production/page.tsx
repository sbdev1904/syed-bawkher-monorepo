"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wrench, Clock, CheckCircle2, User, LucideIcon } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface ProductionItem {
  id: string;
  orderNo: string;
  customer: string;
  items: string[];
  assignedTo?: string;
  dueDate: string;
  progress: number;
  priority: "high" | "medium" | "low";
}

interface ProductionColumn {
  title: string;
  items: ProductionItem[];
}

export default function ProductionPage() {
  // Mock data for production items
  const [columns] = useState<ProductionColumn[]>([
    {
      title: "To Do",
      items: [
        {
          id: "1",
          orderNo: "ORD001",
          customer: "John Doe",
          items: ["Suit", "Shirt"],
          dueDate: "2024-04-15",
          progress: 0,
          priority: "high",
        },
        {
          id: "2",
          orderNo: "ORD002",
          customer: "Jane Smith",
          items: ["Dress"],
          dueDate: "2024-04-20",
          progress: 0,
          priority: "medium",
        },
      ],
    },
    {
      title: "In Progress",
      items: [
        {
          id: "3",
          orderNo: "ORD003",
          customer: "Mike Johnson",
          items: ["Jacket"],
          assignedTo: "Tailor 1",
          dueDate: "2024-04-10",
          progress: 60,
          priority: "high",
        },
      ],
    },
    {
      title: "Quality Check",
      items: [
        {
          id: "4",
          orderNo: "ORD004",
          customer: "Sarah Wilson",
          items: ["Pants", "Vest"],
          assignedTo: "Tailor 2",
          dueDate: "2024-04-08",
          progress: 90,
          priority: "medium",
        },
      ],
    },
    {
      title: "Completed",
      items: [
        {
          id: "5",
          orderNo: "ORD005",
          customer: "David Brown",
          items: ["Suit"],
          assignedTo: "Tailor 1",
          dueDate: "2024-04-05",
          progress: 100,
          priority: "low",
        },
      ],
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: LucideIcon }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
          </div>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Production Management</h1>
          <Button>
            <Wrench className="mr-2 h-4 w-4" />
            Manage Tailors
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total In Production" value={8} icon={Wrench} />
          <StatCard title="Pending Assignment" value={2} icon={Clock} />
          <StatCard title="In Quality Check" value={1} icon={Clock} />
          <StatCard title="Completed Today" value={5} icon={CheckCircle2} />
        </div>

        <div className="grid grid-cols-4 gap-4">
          {columns.map((column) => (
            <div key={column.title} className="bg-secondary/10 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
                {column.title}
                <Badge variant="secondary">{column.items.length}</Badge>
              </h3>
              <div className="space-y-4">
                {column.items.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{item.orderNo}</span>
                        <Badge variant={getPriorityColor(item.priority)}>
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.customer}</div>
                      <div className="flex flex-wrap gap-1">
                        {item.items.map((itemName) => (
                          <Badge key={itemName} variant="outline">{itemName}</Badge>
                        ))}
                      </div>
                      {item.assignedTo && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{item.assignedTo}</span>
                        </div>
                      )}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{item.dueDate}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Due Date</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {item.progress > 0 && (
                        <Progress value={item.progress} className="h-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

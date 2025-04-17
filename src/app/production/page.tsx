"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Wrench, Clock, CheckCircle2, User, LucideIcon } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";

interface ProductionItem {
  id: string;
  orderNo: string;
  customer: string;
  items: string[];
  assignedTo?: string;
  dueDate: string;
  progress: number;
  priority: "high" | "medium" | "low";
  status: "pattern_cutting_pending" | "tailor_assignment_pending" | "base_suit_production" | "trial_pending" | "final_production" | "final_fitting_pending" | "delivery_pending" | "delivered";
}

interface ProductionColumn {
  title: string;
  status: ProductionItem["status"];
  items: ProductionItem[];
}

export default function ProductionPage() {
  const [mounted, setMounted] = useState(false);
  const [columns, setColumns] = useState<ProductionColumn[]>([
    {
      title: "Pattern Cutting",
      status: "pattern_cutting_pending",
      items: [
        {
          id: "1",
          orderNo: "ORD001",
          customer: "John Doe",
          items: ["Suit", "Shirt"],
          dueDate: "2024-04-15",
          progress: 0,
          priority: "high",
          status: "pattern_cutting_pending"
        },
        {
          id: "2",
          orderNo: "ORD002",
          customer: "Jane Smith",
          items: ["Suit", "Shirt"],
          dueDate: "2024-04-15",
          progress: 0,
          priority: "high",
          status: "pattern_cutting_pending"
        },
      ],
    },
    {
      title: "Tailor Assignment",
      status: "tailor_assignment_pending",
      items: [
        {
          id: "9",
          orderNo: "ORD002",
          customer: "Jane Smith",
          items: ["Suit"],
          dueDate: "2024-04-20",
          progress: 15,
          priority: "medium",
          status: "tailor_assignment_pending"
        },
      ],
    },
    {
      title: "Base Production",
      status: "base_suit_production",
      items: [
        {
          id: "3",
          orderNo: "ORD003",
          customer: "Mike Johnson",
          items: ["Suit"],
          assignedTo: "Tailor 1",
          dueDate: "2024-04-10",
          progress: 40,
          priority: "high",
          status: "base_suit_production"
        },
      ],
    },
    {
      title: "Trial Pending",
      status: "trial_pending",
      items: [
        {
          id: "4",
          orderNo: "ORD004",
          customer: "Sarah Wilson",
          items: ["Suit"],
          assignedTo: "Tailor 2",
          dueDate: "2024-04-08",
          progress: 60,
          priority: "medium",
          status: "trial_pending"
        },
      ],
    },
    {
      title: "Final Production",
      status: "final_production",
      items: [
        {
          id: "5",
          orderNo: "ORD005",
          customer: "Alex Brown",
          items: ["Suit"],
          assignedTo: "Tailor 1",
          dueDate: "2024-04-07",
          progress: 75,
          priority: "high",
          status: "final_production"
        },
      ],
    },
    {
      title: "Final Fitting",
      status: "final_fitting_pending",
      items: [
        {
          id: "6",
          orderNo: "ORD006",
          customer: "Emma Davis",
          items: ["Suit"],
          assignedTo: "Tailor 2",
          dueDate: "2024-04-06",
          progress: 90,
          priority: "medium",
          status: "final_fitting_pending"
        },
      ],
    },
    {
      title: "Delivery Pending",
      status: "delivery_pending",
      items: [
        {
          id: "7",
          orderNo: "ORD007",
          customer: "Tom Wilson",
          items: ["Suit"],
          assignedTo: "Tailor 1",
          dueDate: "2024-04-05",
          progress: 95,
          priority: "low",
          status: "delivery_pending"
        },
        {
          id: "8",
          orderNo: "ORD008",
          customer: "Tom Wilson",
          items: ["Suit"],
          assignedTo: "Tailor 1",
          dueDate: "2024-04-05",
          progress: 95,
          priority: "low",
          status: "delivery_pending"
        },
      ],
    },
    {
      title: "Delivered",
      status: "delivered",
      items: [
        {
          id: "10",
          orderNo: "ORD008",
          customer: "David Brown",
          items: ["Suit"],
          assignedTo: "Tailor 1",
          dueDate: "2024-04-04",
          progress: 100,
          priority: "low",
          status: "delivered"
        },
      ],
    },
  ]);

  // Only render the drag and drop interface after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const StatCard = ({ title, value, icon: Icon, className }: { title: string; value: number; icon: LucideIcon; className?: string }) => (
    <div className={`bg-[#0C1222] rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside a droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a deep copy of the columns array to avoid direct state mutations
    const newColumns = [...columns];
    const sourceColIndex = newColumns.findIndex(col => col.status === source.droppableId);
    const destColIndex = newColumns.findIndex(col => col.status === destination.droppableId);

    if (sourceColIndex === -1 || destColIndex === -1) return;

    // Create new arrays for the affected columns
    const sourceItems = [...newColumns[sourceColIndex].items];
    const destItems = sourceColIndex === destColIndex
      ? sourceItems
      : [...newColumns[destColIndex].items];

    // Remove the item from source
    const [movedItem] = sourceItems.splice(source.index, 1);

    // Add the item to destination
    if (sourceColIndex === destColIndex) {
      sourceItems.splice(destination.index, 0, movedItem);
    } else {
      // Update the status when moving between columns
      const updatedItem = {
        ...movedItem,
        status: destination.droppableId as ProductionItem["status"]
      };
      destItems.splice(destination.index, 0, updatedItem);
    }

    // Update the columns with new items
    newColumns[sourceColIndex] = {
      ...newColumns[sourceColIndex],
      items: sourceItems
    };

    if (sourceColIndex !== destColIndex) {
      newColumns[destColIndex] = {
        ...newColumns[destColIndex],
        items: destItems
      };
    }

    // Update state with the new columns
    setColumns(newColumns);
  };

  // Don't render drag and drop content until mounted
  if (!mounted) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-white">Production Management</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-4">
            {/* StatCards */}
          </div>
          <div className="relative w-full">
            <div className="overflow-x-auto">
              <div className="inline-flex gap-4 pb-4 px-4" style={{ width: 'max-content' }}>
                {/* Loading state or static content */}
                <div>Loading...</div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-white">Production Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-4">
          <StatCard
            title="In Production"
            value={columns.reduce((acc, col) => col.status !== "delivered" ? acc + col.items.length : acc, 0)}
            icon={Wrench}
            className="hover:bg-[#141B2D] transition-colors duration-200"
          />
          <StatCard
            title="Pattern Cutting"
            value={columns.find(col => col.status === "pattern_cutting_pending")?.items.length || 0}
            icon={Clock}
            className="hover:bg-[#141B2D] transition-colors duration-200"
          />
          <StatCard
            title="Final Fitting"
            value={columns.find(col => col.status === "final_fitting_pending")?.items.length || 0}
            icon={Clock}
            className="hover:bg-[#141B2D] transition-colors duration-200"
          />
          <StatCard
            title="Delivered Today"
            value={columns.find(col => col.status === "delivered")?.items.length || 0}
            icon={CheckCircle2}
            className="hover:bg-[#141B2D] transition-colors duration-200"
          />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="relative w-full">
            <div className="overflow-x-auto">
              <div className="inline-flex gap-4 pb-4 px-4" style={{ width: 'max-content' }}>
                {columns.map((column) => (
                  <div key={column.title} className="bg-[#1A2333] p-4 rounded-lg w-[320px] shrink-0">
                    <h3 className="text-base font-semibold mb-4 flex justify-between items-center text-white">
                      {column.title}
                      <Badge variant="secondary" className="bg-[#0C1222] text-white">{column.items.length}</Badge>
                    </h3>
                    <Droppable droppableId={column.status}>
                      {(provided: DroppableProvided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-4 min-h-[50px]"
                        >
                          {column.items.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={provided.draggableProps.style}
                                  className={`bg-[#0C1222] p-4 rounded-lg cursor-move transition-colors ${snapshot.isDragging ? "opacity-70 shadow-lg ring-2 ring-primary" : ""
                                    } hover:bg-[#141B2D]`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-white">{item.orderNo}</span>
                                    <Badge variant={getPriorityColor(item.priority)} className="uppercase">
                                      {item.priority}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">{item.customer}</div>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {item.items.map((itemName) => (
                                      <Badge key={itemName} variant="outline" className="bg-transparent border-[#2A3441] text-muted-foreground">
                                        {itemName}
                                      </Badge>
                                    ))}
                                  </div>
                                  {item.assignedTo && (
                                    <div className="flex items-center gap-2 mb-3">
                                      <Avatar className="h-6 w-6 bg-[#1A2333]">
                                        <AvatarFallback>
                                          <User className="h-4 w-4" />
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-muted-foreground">{item.assignedTo}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{item.dueDate}</span>
                                  </div>
                                  {item.progress > 0 && (
                                    <Progress value={item.progress} className="h-1 mt-3 bg-[#1A2333]" />
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </DashboardLayout>
  );
}

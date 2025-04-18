"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Clock, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import type { ProductionStatus } from "@prisma/client";

interface ProductionItem {
  id: string;
  orderNo: string;
  customer: {
    first_name: string;
    last_name: string;
  };
  items: {
    item_name: string;
  }[];
  tailors: {
    tailor: {
      first_name: string;
      last_name: string;
    };
  }[];
  order: {
    date: string;
  };
  status: ProductionStatus;
  notes?: string;
}

interface ProductionColumn {
  title: string;
  status: ProductionStatus;
  items: ProductionItem[];
}

const COLUMN_TITLES: { [key in ProductionStatus]: string } = {
  PATTERN_CUTTING_PENDING: "Pattern Cutting",
  TAILOR_ASSIGNMENT_PENDING: "Tailor Assignment",
  BASE_SUIT_PRODUCTION: "Base Production",
  TRIAL_PENDING: "Trial Pending",
  FINAL_PRODUCTION: "Final Production",
  FINAL_FITTING_PENDING: "Final Fitting",
  DELIVERY_PENDING: "Delivery Pending",
  DELIVERED: "Delivered"
};

const getProgressByStatus = (status: ProductionStatus): number => {
  const progressMap: { [key in ProductionStatus]: number } = {
    PATTERN_CUTTING_PENDING: 0,
    TAILOR_ASSIGNMENT_PENDING: 15,
    BASE_SUIT_PRODUCTION: 30,
    TRIAL_PENDING: 45,
    FINAL_PRODUCTION: 60,
    FINAL_FITTING_PENDING: 75,
    DELIVERY_PENDING: 90,
    DELIVERED: 100
  };
  return progressMap[status];
};

export default function ProductionPage() {
  const [mounted, setMounted] = useState(false);
  const [columns, setColumns] = useState<ProductionColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const response = await fetch("/api/production/all");
      const data = await response.json();

      // Group items by status
      const groupedByStatus = data.reduce((acc: { [key in ProductionStatus]: ProductionItem[] }, item: ProductionItem) => {
        if (!acc[item.status]) {
          acc[item.status] = [];
        }
        acc[item.status].push(item);
        return acc;
      }, {} as { [key in ProductionStatus]: ProductionItem[] });

      // Create columns array
      const newColumns = Object.entries(COLUMN_TITLES).map(([status, title]) => ({
        title,
        status: status as ProductionStatus,
        items: groupedByStatus[status as ProductionStatus] || []
      }));

      setColumns(newColumns);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch production data:", error);
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a deep copy of the columns array
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

    // Create updated item with new status
    const updatedItem = sourceColIndex === destColIndex
      ? movedItem
      : {
        ...movedItem,
        status: destination.droppableId as ProductionStatus
      };

    // Add the item to destination
    if (sourceColIndex === destColIndex) {
      sourceItems.splice(destination.index, 0, updatedItem);
    } else {
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

    // Update state immediately (optimistic update)
    setColumns(newColumns);

    // If moving between columns, update the backend
    if (sourceColIndex !== destColIndex) {
      try {
        const response = await fetch(`/api/production`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderNo: movedItem.orderNo,
            status: destination.droppableId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }
      } catch (error) {
        console.error("Failed to update production status:", error);
        // Revert the UI state on error
        setColumns(columns);
        // You might want to show an error message to the user here
        // toast.error("Failed to update status. Please try again.");
      }
    }
  };

  if (!mounted || loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-white">Production Management</h1>
          <div className="relative w-full">
            <div className="overflow-x-auto">
              <div className="inline-flex gap-4 pb-4 px-4" style={{ width: 'max-content' }}>
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
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {item.customer.first_name} {item.customer.last_name}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {item.items.map((itemObj, idx) => (
                                      <Badge key={idx} variant="outline" className="bg-transparent border-[#2A3441] text-muted-foreground">
                                        {itemObj.item_name}
                                      </Badge>
                                    ))}
                                  </div>
                                  {item.tailors.length > 0 && (
                                    <div className="flex items-center gap-2 mb-3">
                                      <Avatar className="h-6 w-6 bg-[#1A2333]">
                                        <AvatarFallback>
                                          <User className="h-4 w-4" />
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-muted-foreground">
                                        {item.tailors[0].tailor.first_name} {item.tailors[0].tailor.last_name}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      {new Date(item.order.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <Progress
                                    value={getProgressByStatus(item.status)}
                                    className="h-1 mt-3 bg-[#1A2333]"
                                  />
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

"use client";

import React from "react";
import LogsTable from "@/app/components/tables/LogsTable";
import { LogEntry } from "@/lib/logs";

const hardcodedLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: new Date("2024-03-27T10:30:00").toISOString(),
    type: "order",
    user: "john.doe",
    description: "Created new order #ORD-2024-001",
    details: {
      orderId: "ORD-2024-001",
      customerName: "Alex Smith",
      items: [
        { type: "jacket", quantity: 1 },
        { type: "pants", quantity: 2 },
      ],
      totalAmount: 1500,
    },
  },
  {
    id: 2,
    timestamp: new Date("2024-03-27T11:15:00").toISOString(),
    type: "inventory",
    user: "sarah.wilson",
    description: "Added new fabric stock",
    details: {
      fabricId: "FAB-123",
      fabricName: "Premium Wool",
      quantity: 50,
      unit: "meters",
      location: "Warehouse A",
    },
  },
  {
    id: 3,
    timestamp: new Date("2024-03-27T12:00:00").toISOString(),
    type: "status",
    user: "mike.brown",
    description: "Updated order status #ORD-2024-001",
    details: {
      orderId: "ORD-2024-001",
      oldStatus: "pending",
      newStatus: "in_progress",
      notes: "Started cutting fabric",
    },
  },
  {
    id: 4,
    timestamp: new Date("2024-03-27T13:45:00").toISOString(),
    type: "inventory",
    user: "sarah.wilson",
    description: "Removed fabric from stock",
    details: {
      fabricId: "FAB-123",
      fabricName: "Premium Wool",
      quantity: 5,
      unit: "meters",
      reason: "Order #ORD-2024-001",
    },
  },
  {
    id: 5,
    timestamp: new Date("2024-03-27T14:30:00").toISOString(),
    type: "order",
    user: "john.doe",
    description: "Modified order #ORD-2024-001",
    details: {
      orderId: "ORD-2024-001",
      changes: {
        added: [{ type: "vest", quantity: 1 }],
        modified: [{ type: "pants", oldQuantity: 2, newQuantity: 1 }],
      },
      reason: "Customer request",
    },
  },
  {
    id: 6,
    timestamp: new Date("2024-03-27T15:00:00").toISOString(),
    type: "status",
    user: "mike.brown",
    description: "Updated measurements for order #ORD-2024-001",
    details: {
      orderId: "ORD-2024-001",
      itemType: "jacket",
      changes: {
        chest: "42 inches",
        shoulder: "18 inches",
        sleeve: "24 inches",
      },
    },
  },
  {
    id: 7,
    timestamp: new Date("2024-03-27T16:15:00").toISOString(),
    type: "inventory",
    user: "sarah.wilson",
    description: "Stock count adjustment",
    details: {
      fabricId: "FAB-124",
      fabricName: "Cotton Shirting",
      oldQuantity: 100,
      newQuantity: 95,
      reason: "Inventory audit",
    },
  },
  {
    id: 8,
    timestamp: new Date("2024-03-27T17:00:00").toISOString(),
    type: "order",
    user: "john.doe",
    description: "Created new order #ORD-2024-002",
    details: {
      orderId: "ORD-2024-002",
      customerName: "Emma Johnson",
      items: [{ type: "shirt", quantity: 3 }],
      totalAmount: 750,
    },
  },
  {
    id: 9,
    timestamp: new Date("2024-03-27T17:30:00").toISOString(),
    type: "status",
    user: "mike.brown",
    description: "Completed order #ORD-2024-001",
    details: {
      orderId: "ORD-2024-001",
      oldStatus: "in_progress",
      newStatus: "completed",
      completionDate: "2024-03-27",
      qualityCheck: "passed",
    },
  },
  {
    id: 10,
    timestamp: new Date("2024-03-27T18:00:00").toISOString(),
    type: "inventory",
    user: "sarah.wilson",
    description: "Low stock alert",
    details: {
      fabricId: "FAB-123",
      fabricName: "Premium Wool",
      currentStock: 10,
      minimumRequired: 20,
      reorderSuggested: true,
    },
  },
];

const LogsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Activity Logs</h1>
        <p className="text-gray-600">
          View and analyze all user actions and system changes
        </p>
      </div>
      <LogsTable initialLogs={hardcodedLogs} />
    </div>
  );
};

export default LogsPage;

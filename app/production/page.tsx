"use client";

import React, { useState } from "react";
import { Table, Tag, Button, Select, Card, Row, Col, Statistic } from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  ProductionOrder,
  ProductionStatus,
  Tailor,
} from "@/app/types/production";

const { Option } = Select;

// Hardcoded data
const mockTailors: Tailor[] = [
  { id: "T1", name: "John Smith", specialization: "suit", currentLoad: 3 },
  { id: "T2", name: "Mary Johnson", specialization: "both", currentLoad: 2 },
  { id: "T3", name: "Robert Lee", specialization: "shirt", currentLoad: 1 },
  { id: "T4", name: "Sarah Wilson", specialization: "suit", currentLoad: 4 },
];

const mockOrders: ProductionOrder[] = [
  {
    orderId: "ORD-2024-001",
    customerName: "Alex Brown",
    items: [{ type: "suit", quantity: 1 }],
    status: "pattern_cutting_pending",
    dueDate: "2024-04-15",
    priority: "high",
    startDate: "2024-03-27",
  },
  {
    orderId: "ORD-2024-002",
    customerName: "Emma Wilson",
    items: [{ type: "shirt", quantity: 3 }],
    status: "tailor_assignment_pending",
    dueDate: "2024-04-20",
    priority: "medium",
    startDate: "2024-03-26",
  },
  {
    orderId: "ORD-2024-003",
    customerName: "James Miller",
    items: [
      { type: "suit", quantity: 1 },
      { type: "shirt", quantity: 2 },
    ],
    status: "base_suit_production",
    assignedTailor: "T1",
    dueDate: "2024-04-10",
    priority: "high",
    startDate: "2024-03-25",
  },
  {
    orderId: "ORD-2024-004",
    customerName: "Sophie Clark",
    items: [{ type: "suit", quantity: 1 }],
    status: "trial_pending",
    assignedTailor: "T4",
    dueDate: "2024-04-12",
    priority: "medium",
    startDate: "2024-03-24",
  },
];

const statusColors: Record<ProductionStatus, string> = {
  pattern_cutting_pending: "gold",
  tailor_assignment_pending: "orange",
  base_suit_production: "processing",
  trial_pending: "cyan",
  final_production: "blue",
  final_fitting_pending: "geekblue",
  delivery_pending: "purple",
  delivered: "green",
};

const statusLabels: Record<ProductionStatus, string> = {
  pattern_cutting_pending: "Pattern Cutting Pending",
  tailor_assignment_pending: "Tailor Assignment Pending",
  base_suit_production: "Base Suit Production",
  trial_pending: "Trial Pending",
  final_production: "Final Production",
  final_fitting_pending: "Final Fitting Pending",
  delivery_pending: "Delivery Pending",
  delivered: "Delivered",
};

export default function ProductionDashboard() {
  const [selectedTailor, setSelectedTailor] = useState<string>();

  const columns: ColumnsType<ProductionOrder> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <>
          {record.items.map((item, index) => (
            <Tag key={index}>
              {item.quantity}x {item.type}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={statusColors[record.status]}>
          {statusLabels[record.status]}
        </Tag>
      ),
      filters: Object.entries(statusLabels).map(([value, text]) => ({
        text,
        value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Assigned Tailor",
      key: "assignedTailor",
      render: (_, record) =>
        record.status !== "delivered" ? (
          <Select
            style={{ width: 150 }}
            value={record.assignedTailor}
            onChange={(value) => console.log("Assign tailor:", value)}
            placeholder="Select tailor"
          >
            {mockTailors.map((tailor) => (
              <Option key={tailor.id} value={tailor.id}>
                {tailor.name} ({tailor.currentLoad})
              </Option>
            ))}
          </Select>
        ) : (
          "-"
        ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) =>
        new Date(a.dueDate).valueOf() - new Date(b.dueDate).valueOf(),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Priority",
      key: "priority",
      dataIndex: "priority",
      render: (priority) => (
        <Tag
          color={
            priority === "high"
              ? "red"
              : priority === "medium"
              ? "orange"
              : "green"
          }
        >
          {priority.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "High", value: "high" },
        { text: "Medium", value: "medium" },
        { text: "Low", value: "low" },
      ],
      onFilter: (value, record) => record.priority === value,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Production Dashboard</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Active Orders"
              value={mockOrders.filter((o) => o.status !== "delivered").length}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Assignment"
              value={
                mockOrders.filter(
                  (o) => o.status === "tailor_assignment_pending"
                ).length
              }
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="In Production"
              value={
                mockOrders.filter((o) =>
                  [
                    "base_suit_production",
                    "trial_pending",
                    "final_production",
                  ].includes(o.status)
                ).length
              }
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ready for Delivery"
              value={
                mockOrders.filter((o) => o.status === "delivery_pending").length
              }
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={mockOrders}
        rowKey="orderId"
        pagination={false}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
}

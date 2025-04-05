"use client";

import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Tabs,
  Tree,
  Space,
  Badge,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, WarningOutlined } from "@ant-design/icons";
import type {
  InventoryItem,
  Location,
  Rack,
  Supplier,
} from "@/app/types/inventory";

const { Option } = Select;
const { TabPane } = Tabs;

// Hardcoded data
const mockLocations: Location[] = [
  { id: "L1", name: "Main Warehouse", description: "Primary storage facility" },
  { id: "L2", name: "Workshop Storage", description: "Near production area" },
];

const mockRacks: Rack[] = [
  {
    id: "R1",
    name: "Rack A1",
    locationId: "L1",
    capacity: 100,
    currentOccupancy: 75,
  },
  {
    id: "R2",
    name: "Rack A2",
    locationId: "L1",
    capacity: 100,
    currentOccupancy: 45,
  },
  {
    id: "R3",
    name: "Rack B1",
    locationId: "L2",
    capacity: 50,
    currentOccupancy: 30,
  },
];

const mockSuppliers: Supplier[] = [
  {
    id: "S1",
    name: "Premium Fabrics Ltd",
    contactPerson: "John Smith",
    email: "john@premiumfabrics.com",
    phone: "+1234567890",
    address: "123 Fabric Street",
    rating: 4.5,
    activeFrom: "2023-01-01",
  },
  {
    id: "S2",
    name: "Quality Materials Co",
    contactPerson: "Emma Wilson",
    email: "emma@qualitymaterials.com",
    phone: "+1234567891",
    address: "456 Material Avenue",
    rating: 4.8,
    activeFrom: "2023-03-15",
  },
];

const mockItems: InventoryItem[] = [
  {
    id: "I1",
    sku: "FAB-001",
    name: "Premium Wool",
    type: "fabric",
    description: "High-quality wool fabric",
    quantity: 150,
    unit: "meters",
    minStockLevel: 100,
    bunchId: "B1",
    suppliers: [
      { supplierId: "S1", price: 45.99, leadTime: 7, minimumOrderQuantity: 50 },
      { supplierId: "S2", price: 48.99, leadTime: 5, minimumOrderQuantity: 30 },
    ],
    tags: ["wool", "premium", "suit"],
    createdAt: "2024-01-01",
    updatedAt: "2024-03-27",
  },
  {
    id: "I2",
    sku: "BTN-001",
    name: "Pearl Buttons",
    type: "raw_material",
    description: "Mother of pearl buttons",
    quantity: 1000,
    unit: "pieces",
    minStockLevel: 500,
    suppliers: [
      { supplierId: "S2", price: 0.99, leadTime: 3, minimumOrderQuantity: 100 },
    ],
    tags: ["buttons", "pearl"],
    createdAt: "2024-01-15",
    updatedAt: "2024-03-26",
  },
];

const locationTreeData = mockLocations.map((location) => ({
  title: location.name,
  key: location.id,
  children: mockRacks
    .filter((rack) => rack.locationId === location.id)
    .map((rack) => ({
      title: (
        <span>
          {rack.name}{" "}
          <Tag
            color={
              rack.currentOccupancy > rack.capacity * 0.8 ? "red" : "green"
            }
          >
            {rack.currentOccupancy}/{rack.capacity}
          </Tag>
        </span>
      ),
      key: rack.id,
    })),
}));

export default function InventoryDashboard() {
  const [selectedLocation, setSelectedLocation] = useState<string>();
  const [searchText, setSearchText] = useState("");

  const columns: ColumnsType<InventoryItem> = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "fabric"
              ? "blue"
              : type === "raw_material"
              ? "green"
              : "orange"
          }
        >
          {type.replace("_", " ").toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Fabric", value: "fabric" },
        { text: "Raw Material", value: "raw_material" },
        { text: "Packaging", value: "packaging" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <Space>
          {record.quantity} {record.unit}
          {record.quantity <= record.minStockLevel && (
            <Badge count={<WarningOutlined style={{ color: "#faad14" }} />} />
          )}
        </Space>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Suppliers",
      key: "suppliers",
      render: (_, record) => (
        <>
          {record.suppliers.map((supplier) => {
            const supplierData = mockSuppliers.find(
              (s) => s.id === supplier.supplierId
            );
            return (
              <Tag key={supplier.supplierId} color="blue">
                {supplierData?.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic title="Total Items" value={mockItems.length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={
                mockItems.filter((item) => item.quantity <= item.minStockLevel)
                  .length
              }
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Suppliers"
              value={mockSuppliers.length}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Storage Utilization"
              value={Math.round(
                (mockRacks.reduce(
                  (acc, rack) => acc + rack.currentOccupancy,
                  0
                ) /
                  mockRacks.reduce((acc, rack) => acc + rack.capacity, 0)) *
                  100
              )}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="Location Hierarchy" className="mb-4">
            <Tree
              treeData={locationTreeData}
              defaultExpandAll
              onSelect={(keys) => setSelectedLocation(keys[0] as string)}
            />
          </Card>
        </Col>
        <Col span={18}>
          <Card>
            <div className="mb-4">
              <Input
                placeholder="Search inventory..."
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            <Table
              columns={columns}
              dataSource={mockItems}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
